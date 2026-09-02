from django.db import transaction
from django.utils import timezone

from apps.audit.models import AuditCategory
from apps.audit.services import AuditService
from apps.authorization.exceptions import AuthorizationDenied
from apps.properties.models import PropertyStatus

from .models import Offer, OfferEvent, OfferEventType, OfferStatus
from .policies import OfferPolicy


ACTIVE_OFFER_STATUSES = {
    OfferStatus.PENDING,
    OfferStatus.COUNTERED,
}


class OfferService:

    @staticmethod
    @transaction.atomic
    def create_offer(
        *,
        party,
        listing,
        validated_data,
    ):
        if not OfferPolicy.can_create(
            party=party,
            listing=listing,
        ):
            raise AuthorizationDenied()

        offer = Offer.objects.create(
            listing=listing,
            buyer_party=party,
            created_by=party.user,
            **validated_data,
        )

        OfferService._record_event(
            offer=offer,
            actor=party.user,
            event_type=OfferEventType.CREATED,
            amount=offer.amount,
            currency=offer.currency,
            message=offer.message,
        )

        AuditService.record(
            actor=party.user,
            category=AuditCategory.OFFER,
            action="offer.created",
            resource=offer,
            summary="Offer created.",
            after={
                "listing_id": str(listing.id),
                "buyer_party_id": str(party.id),
                "amount": str(offer.amount),
                "currency": offer.currency,
                "status": offer.status,
            },
        )

        return offer

    @staticmethod
    @transaction.atomic
    def accept_offer(
        *,
        party,
        offer,
        message="",
    ):
        OfferService._ensure_can_respond(
            party=party,
            offer=offer,
        )

        previous_status = offer.status

        offer.status = OfferStatus.ACCEPTED
        offer.responded_by = party.user
        offer.responded_at = timezone.now()
        offer.save(
            update_fields=[
                "status",
                "responded_by",
                "responded_at",
                "updated_at",
            ]
        )

        property = offer.listing.property
        property.status = PropertyStatus.UNDER_OFFER
        property.save(
            update_fields=[
                "status",
                "updated_at",
            ]
        )

        from apps.transactions.services import TransactionService

        TransactionService.create_from_offer(
            offer=offer,
            initiated_by=party.user,
        )

        OfferService._record_event(
            offer=offer,
            actor=party.user,
            event_type=OfferEventType.ACCEPTED,
            message=message,
        )

        AuditService.record(
            actor=party.user,
            category=AuditCategory.OFFER,
            action="offer.accepted",
            resource=offer,
            summary="Offer accepted.",
            before={
                "status": previous_status,
            },
            after={
                "status": offer.status,
                "property_status": property.status,
            },
            metadata={
                "party_id": str(party.id),
            },
        )

        return offer

    @staticmethod
    @transaction.atomic
    def reject_offer(
        *,
        party,
        offer,
        message="",
    ):
        OfferService._ensure_can_respond(
            party=party,
            offer=offer,
        )

        previous_status = offer.status

        offer.status = OfferStatus.REJECTED
        offer.responded_by = party.user
        offer.responded_at = timezone.now()
        offer.save(
            update_fields=[
                "status",
                "responded_by",
                "responded_at",
                "updated_at",
            ]
        )

        OfferService._record_event(
            offer=offer,
            actor=party.user,
            event_type=OfferEventType.REJECTED,
            message=message,
        )

        AuditService.record(
            actor=party.user,
            category=AuditCategory.OFFER,
            action="offer.rejected",
            resource=offer,
            summary="Offer rejected.",
            before={
                "status": previous_status,
            },
            after={
                "status": offer.status,
            },
            metadata={
                "party_id": str(party.id),
            },
        )

        return offer

    @staticmethod
    @transaction.atomic
    def counter_offer(
        *,
        party,
        offer,
        amount,
        currency,
        message="",
    ):
        OfferService._ensure_can_respond(
            party=party,
            offer=offer,
        )

        previous_status = offer.status
        previous_amount = offer.amount
        previous_currency = offer.currency

        offer.status = OfferStatus.COUNTERED
        offer.amount = amount
        offer.currency = currency
        offer.responded_by = party.user
        offer.responded_at = timezone.now()
        offer.save(
            update_fields=[
                "status",
                "amount",
                "currency",
                "responded_by",
                "responded_at",
                "updated_at",
            ]
        )

        OfferService._record_event(
            offer=offer,
            actor=party.user,
            event_type=OfferEventType.COUNTERED,
            amount=amount,
            currency=currency,
            message=message,
            metadata={
                "previous_amount": str(previous_amount),
                "previous_currency": previous_currency,
            },
        )

        AuditService.record(
            actor=party.user,
            category=AuditCategory.OFFER,
            action="offer.countered",
            resource=offer,
            summary="Offer countered.",
            before={
                "status": previous_status,
                "amount": str(previous_amount),
                "currency": previous_currency,
            },
            after={
                "status": offer.status,
                "amount": str(offer.amount),
                "currency": offer.currency,
            },
            metadata={
                "party_id": str(party.id),
            },
        )

        return offer

    @staticmethod
    @transaction.atomic
    def withdraw_offer(
        *,
        party,
        offer,
        message="",
    ):
        if not OfferPolicy.can_withdraw(
            party=party,
            offer=offer,
        ):
            raise AuthorizationDenied()

        if offer.status not in ACTIVE_OFFER_STATUSES:
            raise ValueError(
                "Only active offers can be withdrawn."
            )

        previous_status = offer.status

        offer.status = OfferStatus.WITHDRAWN
        offer.withdrawn_at = timezone.now()
        offer.save(
            update_fields=[
                "status",
                "withdrawn_at",
                "updated_at",
            ]
        )

        OfferService._record_event(
            offer=offer,
            actor=party.user,
            event_type=OfferEventType.WITHDRAWN,
            message=message,
        )

        AuditService.record(
            actor=party.user,
            category=AuditCategory.OFFER,
            action="offer.withdrawn",
            resource=offer,
            summary="Offer withdrawn.",
            before={
                "status": previous_status,
            },
            after={
                "status": offer.status,
            },
            metadata={
                "party_id": str(party.id),
            },
        )

        return offer

    @staticmethod
    def _ensure_can_respond(
        *,
        party,
        offer,
    ):
        if not OfferPolicy.can_respond(
            party=party,
            offer=offer,
        ):
            raise AuthorizationDenied()

        if offer.status not in ACTIVE_OFFER_STATUSES:
            raise ValueError(
                "Only active offers can be changed."
            )

    @staticmethod
    def _record_event(
        *,
        offer,
        actor,
        event_type,
        amount=None,
        currency="",
        message="",
        metadata=None,
    ):
        return OfferEvent.objects.create(
            offer=offer,
            actor=actor,
            event_type=event_type,
            amount=amount,
            currency=currency or "",
            message=message,
            metadata=metadata or {},
        )
