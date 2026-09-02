from django.db import transaction
from django.db.models import Q
from django.utils import timezone

from apps.audit.models import AuditCategory
from apps.audit.services import AuditService
from apps.authorization.exceptions import AuthorizationDenied
from apps.listings.models import ListingPartyRelationship
from apps.offers.models import OfferStatus
from apps.properties.models import PropertyStatus

from .models import (
    ChecklistItemStatus,
    Transaction,
    TransactionStatus,
    TransferChecklistItem,
)
from .policies import TransactionPolicy


DEFAULT_TRANSFER_CHECKLIST = [
    {
        "title": "Confirm seller warranty",
        "description": (
            "Record the seller warranty or undertaking required by the "
            "approved operating process."
        ),
    },
    {
        "title": "Collect transfer documents",
        "description": (
            "Track the documents required for the legal transfer process."
        ),
    },
    {
        "title": "Record payment trail",
        "description": (
            "Record supported payment references and receipts without "
            "treating payment as automatic ownership transfer."
        ),
    },
    {
        "title": "Track legal transfer steps",
        "description": (
            "Record dated ownership-transfer steps and responsible parties."
        ),
    },
]


ALLOWED_TRANSACTION_TRANSITIONS = {
    TransactionStatus.INITIATED: {
        TransactionStatus.PENDING_PAYMENT,
        TransactionStatus.DOCUMENTATION,
        TransactionStatus.CANCELLED,
        TransactionStatus.DISPUTED,
    },
    TransactionStatus.PENDING_PAYMENT: {
        TransactionStatus.PAYMENT_PROCESSING,
        TransactionStatus.PAYMENT_COMPLETED,
        TransactionStatus.CANCELLED,
        TransactionStatus.DISPUTED,
    },
    TransactionStatus.PAYMENT_PROCESSING: {
        TransactionStatus.PAYMENT_COMPLETED,
        TransactionStatus.PENDING_PAYMENT,
        TransactionStatus.CANCELLED,
        TransactionStatus.DISPUTED,
    },
    TransactionStatus.PAYMENT_COMPLETED: {
        TransactionStatus.DOCUMENTATION,
        TransactionStatus.DISPUTED,
    },
    TransactionStatus.DOCUMENTATION: {
        TransactionStatus.COMPLETED,
        TransactionStatus.CANCELLED,
        TransactionStatus.DISPUTED,
    },
    TransactionStatus.COMPLETED: {
        TransactionStatus.DISPUTED,
    },
    TransactionStatus.CANCELLED: set(),
    TransactionStatus.DISPUTED: {
        TransactionStatus.DOCUMENTATION,
        TransactionStatus.CANCELLED,
    },
}


class TransactionService:

    @staticmethod
    @transaction.atomic
    def create_from_offer(
        *,
        offer,
        initiated_by,
    ):
        if offer.status != OfferStatus.ACCEPTED:
            raise ValueError(
                "Only accepted offers can create transactions."
            )

        seller_party = (
            offer.listing.parties
            .filter(
                relationship=ListingPartyRelationship.OWNER,
                is_active=True,
            )
            .select_related("party")
            .first()
        )

        if seller_party is None:
            raise ValueError(
                "Accepted offer cannot create a transaction without a seller."
            )

        transaction_obj, created = Transaction.objects.get_or_create(
            offer=offer,
            defaults={
                "listing": offer.listing,
                "property": offer.listing.property,
                "buyer_party": offer.buyer_party,
                "seller_party": seller_party.party,
                "agreed_amount": offer.amount,
                "currency": offer.currency,
                "initiated_by": initiated_by,
            },
        )

        if not created:
            return transaction_obj

        TransactionService._create_default_checklist(
            transaction=transaction_obj,
            buyer_party=offer.buyer_party,
            seller_party=seller_party.party,
        )

        AuditService.record(
            actor=initiated_by,
            category=AuditCategory.TRANSACTION,
            action="transaction.initiated",
            resource=transaction_obj,
            summary="Transaction initiated from accepted offer.",
            after={
                "offer_id": str(offer.id),
                "listing_id": str(offer.listing_id),
                "property_id": str(offer.listing.property_id),
                "buyer_party_id": str(offer.buyer_party_id),
                "seller_party_id": str(seller_party.party_id),
                "agreed_amount": str(transaction_obj.agreed_amount),
                "currency": transaction_obj.currency,
                "status": transaction_obj.status,
            },
        )

        return transaction_obj

    @staticmethod
    @transaction.atomic
    def transition(
        *,
        party,
        transaction_obj,
        new_status,
        notes="",
    ):
        if not TransactionPolicy.can_manage(
            party=party,
            transaction=transaction_obj,
        ):
            raise AuthorizationDenied()

        TransactionService.transition_system(
            transaction_obj=transaction_obj,
            new_status=new_status,
            actor=party.user,
            notes=notes,
        )

        return transaction_obj

    @staticmethod
    def transition_system(
        *,
        transaction_obj,
        new_status,
        actor,
        notes="",
    ):
        allowed = ALLOWED_TRANSACTION_TRANSITIONS.get(
            transaction_obj.status,
            set(),
        )

        if new_status not in allowed:
            raise ValueError(
                "Cannot transition transaction "
                f"from {transaction_obj.status} to {new_status}."
            )

        previous_status = transaction_obj.status
        transaction_obj.status = new_status

        update_fields = [
            "status",
            "updated_at",
        ]

        if new_status == TransactionStatus.COMPLETED:
            transaction_obj.completed_at = timezone.now()
            update_fields.append("completed_at")

            property_obj = transaction_obj.property
            property_obj.status = PropertyStatus.SOLD
            property_obj.save(
                update_fields=[
                    "status",
                    "updated_at",
                ]
            )

        if new_status == TransactionStatus.CANCELLED:
            transaction_obj.cancelled_at = timezone.now()
            update_fields.append("cancelled_at")

        transaction_obj.save(
            update_fields=update_fields,
        )

        AuditService.record(
            actor=actor,
            category=AuditCategory.TRANSACTION,
            action="transaction.status_changed",
            resource=transaction_obj,
            summary="Transaction status changed.",
            before={
                "status": previous_status,
            },
            after={
                "status": transaction_obj.status,
            },
            metadata={
                "notes": notes,
            },
        )

        return transaction_obj

    @staticmethod
    @transaction.atomic
    def transition_checklist_item(
        *,
        party,
        transaction_obj,
        checklist_item,
        new_status,
        notes="",
    ):
        if not TransactionPolicy.can_manage(
            party=party,
            transaction=transaction_obj,
        ):
            raise AuthorizationDenied()

        if checklist_item.transaction_id != transaction_obj.id:
            raise ValueError(
                "Checklist item does not belong to this transaction."
            )

        previous_status = checklist_item.status
        checklist_item.status = new_status

        update_fields = [
            "status",
            "updated_at",
            "completed_at",
            "completed_by",
        ]

        if new_status == ChecklistItemStatus.COMPLETED:
            checklist_item.completed_at = timezone.now()
            checklist_item.completed_by = party.user
        else:
            checklist_item.completed_at = None
            checklist_item.completed_by = None

        checklist_item.save(
            update_fields=update_fields,
        )

        AuditService.record(
            actor=party.user,
            category=AuditCategory.TRANSACTION,
            action="transaction.checklist_item_updated",
            resource=checklist_item,
            summary="Transaction checklist item updated.",
            before={
                "status": previous_status,
            },
            after={
                "status": checklist_item.status,
                "transaction_id": str(transaction_obj.id),
            },
            metadata={
                "notes": notes,
            },
        )

        return checklist_item

    @staticmethod
    def timeline(
        *,
        transaction_obj,
    ):
        from apps.audit.models import AuditEvent
        from apps.disputes.models import Dispute
        from apps.documents.models import Document
        from apps.due_diligence.models import DueDiligenceRequest
        from apps.geospatial.models import (
            PropertyBoundary,
            PropertyLocationRecord,
            SiteRisk,
        )
        from apps.payments.models import Payment
        from apps.verification.models import Verification

        resource_pairs = [
            (
                transaction_obj._meta.label,
                str(transaction_obj.id),
            ),
            (
                transaction_obj.offer._meta.label,
                str(transaction_obj.offer_id),
            ),
        ]

        resource_pairs.extend(
            TransactionService._resource_pairs(
                Payment.objects.filter(
                    transaction=transaction_obj,
                )
            )
        )
        resource_pairs.extend(
            TransactionService._resource_pairs(
                Dispute.objects.filter(
                    transaction=transaction_obj,
                )
            )
        )
        resource_pairs.extend(
            TransactionService._resource_pairs(
                DueDiligenceRequest.objects.filter(
                    transaction=transaction_obj,
                )
            )
        )
        resource_pairs.extend(
            TransactionService._resource_pairs(
                TransferChecklistItem.objects.filter(
                    transaction=transaction_obj,
                )
            )
        )

        property_filters = {
            "property": transaction_obj.property,
        }
        resource_pairs.extend(
            TransactionService._resource_pairs(
                Document.objects.filter(
                    **property_filters,
                )
            )
        )
        resource_pairs.extend(
            TransactionService._resource_pairs(
                Verification.objects.filter(
                    **property_filters,
                )
            )
        )
        resource_pairs.extend(
            TransactionService._resource_pairs(
                PropertyLocationRecord.objects.filter(
                    **property_filters,
                )
            )
        )
        resource_pairs.extend(
            TransactionService._resource_pairs(
                PropertyBoundary.objects.filter(
                    **property_filters,
                )
            )
        )
        resource_pairs.extend(
            TransactionService._resource_pairs(
                SiteRisk.objects.filter(
                    **property_filters,
                )
            )
        )

        query = Q()
        for resource_type, resource_id in resource_pairs:
            query |= Q(
                resource_type=resource_type,
                resource_id=resource_id,
            )

        if not query:
            return []

        events = (
            AuditEvent.objects
            .filter(query)
            .select_related("actor")
            .order_by(
                "occurred_at",
                "created_at",
            )
        )

        return [
            TransactionService._timeline_entry(event)
            for event in events
        ]

    @staticmethod
    def _resource_pairs(queryset):
        return [
            (
                queryset.model._meta.label,
                str(resource_id),
            )
            for resource_id in queryset.values_list(
                "id",
                flat=True,
            )
        ]

    @staticmethod
    def _timeline_entry(event):
        title = event.action.replace(
            ".",
            " ",
        ).replace(
            "_",
            " ",
        ).title()

        return {
            "id": str(event.id),
            "type": event.action,
            "title": title,
            "summary": event.summary,
            "category": event.category,
            "resource_type": event.resource_type,
            "resource_id": event.resource_id,
            "actor": event.actor_id,
            "occurred_at": event.occurred_at,
            "before": event.before,
            "after": event.after,
            "metadata": event.metadata,
        }

    @staticmethod
    def _create_default_checklist(
        *,
        transaction,
        buyer_party,
        seller_party,
    ):
        responsibility = [
            seller_party,
            seller_party,
            buyer_party,
            seller_party,
        ]

        for index, item in enumerate(
            DEFAULT_TRANSFER_CHECKLIST,
            start=1,
        ):
            TransferChecklistItem.objects.create(
                transaction=transaction,
                title=item["title"],
                description=item["description"],
                responsible_party=responsibility[index - 1],
                position=index,
            )
