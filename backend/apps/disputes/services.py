from django.db import transaction
from django.utils import timezone

from apps.audit.models import AuditCategory
from apps.audit.services import AuditService
from apps.authorization.exceptions import AuthorizationDenied
from apps.transactions.models import TransactionStatus
from apps.transactions.services import TransactionService

from .models import Dispute, DisputeEvidence, DisputeMessage, DisputeStatus
from .policies import DisputePolicy


class DisputeService:

    @staticmethod
    @transaction.atomic
    def open_dispute(
        *,
        party,
        validated_data,
    ):
        if not DisputePolicy.can_create(
            party=party,
            transaction=validated_data.get("transaction"),
            payment=validated_data.get("payment"),
            listing=validated_data.get("listing"),
            property=validated_data.get("property"),
        ):
            raise AuthorizationDenied()

        dispute = Dispute.objects.create(
            opened_by_party=party,
            opened_by=party.user,
            **validated_data,
        )

        if (
            dispute.transaction
            and dispute.transaction.status != TransactionStatus.DISPUTED
        ):
            TransactionService.transition_system(
                transaction_obj=dispute.transaction,
                new_status=TransactionStatus.DISPUTED,
                actor=party.user,
                notes="Dispute opened.",
            )

        AuditService.record(
            actor=party.user,
            category=AuditCategory.DISPUTE,
            action="dispute.opened",
            resource=dispute,
            summary="Dispute opened.",
            after={
                "status": dispute.status,
                "category": dispute.category,
                "priority": dispute.priority,
                "transaction_id": (
                    str(dispute.transaction_id)
                    if dispute.transaction_id
                    else ""
                ),
            },
        )

        DisputeService._notify_dispute_opened(
            dispute=dispute,
            actor=party.user,
        )

        return dispute

    @staticmethod
    @transaction.atomic
    def start_review(
        *,
        party,
        dispute,
        notes="",
    ):
        if not DisputePolicy.can_review(
            party=party,
        ):
            raise AuthorizationDenied()

        if dispute.status != DisputeStatus.OPEN:
            raise ValueError(
                "Only open disputes can move to review."
            )

        previous_status = dispute.status
        dispute.status = DisputeStatus.UNDER_REVIEW
        dispute.assigned_to = party.user
        dispute.save(
            update_fields=[
                "status",
                "assigned_to",
                "updated_at",
            ]
        )

        AuditService.record(
            actor=party.user,
            category=AuditCategory.DISPUTE,
            action="dispute.review_started",
            resource=dispute,
            summary="Dispute review started.",
            before={
                "status": previous_status,
            },
            after={
                "status": dispute.status,
                "assigned_to": str(party.user_id),
            },
            metadata={
                "notes": notes,
            },
        )

        return dispute

    @staticmethod
    @transaction.atomic
    def resolve_dispute(
        *,
        party,
        dispute,
        resolution_summary,
        next_transaction_status="",
    ):
        if not DisputePolicy.can_review(
            party=party,
        ):
            raise AuthorizationDenied()

        if dispute.status not in {
            DisputeStatus.OPEN,
            DisputeStatus.UNDER_REVIEW,
        }:
            raise ValueError(
                "Only open or under-review disputes can be resolved."
            )

        previous_status = dispute.status
        dispute.status = DisputeStatus.RESOLVED
        dispute.resolution_summary = resolution_summary
        dispute.resolved_by = party.user
        dispute.resolved_at = timezone.now()
        dispute.save(
            update_fields=[
                "status",
                "resolution_summary",
                "resolved_by",
                "resolved_at",
                "updated_at",
            ]
        )

        if (
            dispute.transaction
            and dispute.transaction.status == TransactionStatus.DISPUTED
        ):
            next_status = (
                next_transaction_status
                or TransactionStatus.DOCUMENTATION
            )
            TransactionService.transition_system(
                transaction_obj=dispute.transaction,
                new_status=next_status,
                actor=party.user,
                notes="Dispute resolved.",
            )

        AuditService.record(
            actor=party.user,
            category=AuditCategory.DISPUTE,
            action="dispute.resolved",
            resource=dispute,
            summary="Dispute resolved.",
            before={
                "status": previous_status,
            },
            after={
                "status": dispute.status,
                "next_transaction_status": next_transaction_status,
            },
        )

        from apps.notifications.models import NotificationType
        from apps.notifications.services import NotificationService

        NotificationService.notify_party(
            party=dispute.opened_by_party,
            title="Dispute resolved",
            message="A dispute you opened has been resolved.",
            notification_type=NotificationType.DISPUTE,
            resource=dispute,
            payload={
                "status": dispute.status,
                "resolution_summary": dispute.resolution_summary,
            },
            actor=party.user,
        )

        return dispute

    @staticmethod
    @transaction.atomic
    def close_dispute(
        *,
        party,
        dispute,
        notes="",
    ):
        if not (
            DisputePolicy.can_review(
                party=party,
            )
            or dispute.opened_by_party_id == party.id
        ):
            raise AuthorizationDenied()

        if dispute.status != DisputeStatus.RESOLVED:
            raise ValueError(
                "Only resolved disputes can be closed."
            )

        previous_status = dispute.status
        dispute.status = DisputeStatus.CLOSED
        dispute.closed_at = timezone.now()
        dispute.save(
            update_fields=[
                "status",
                "closed_at",
                "updated_at",
            ]
        )

        AuditService.record(
            actor=party.user,
            category=AuditCategory.DISPUTE,
            action="dispute.closed",
            resource=dispute,
            summary="Dispute closed.",
            before={
                "status": previous_status,
            },
            after={
                "status": dispute.status,
            },
            metadata={
                "notes": notes,
            },
        )

        return dispute

    @staticmethod
    @transaction.atomic
    def add_message(
        *,
        party,
        dispute,
        message,
        is_internal=False,
    ):
        if not DisputePolicy.can_comment(
            party=party,
            dispute=dispute,
            is_internal=is_internal,
        ):
            raise AuthorizationDenied()

        dispute_message = DisputeMessage.objects.create(
            dispute=dispute,
            author_party=party,
            author=party.user,
            message=message,
            is_internal=is_internal,
        )

        AuditService.record(
            actor=party.user,
            category=AuditCategory.DISPUTE,
            action="dispute.message_added",
            resource=dispute,
            summary="Dispute message added.",
            metadata={
                "is_internal": is_internal,
                "message_id": str(dispute_message.id),
            },
        )

        return dispute_message

    @staticmethod
    @transaction.atomic
    def add_evidence(
        *,
        party,
        dispute,
        validated_data,
    ):
        if not DisputePolicy.can_comment(
            party=party,
            dispute=dispute,
        ):
            raise AuthorizationDenied()

        evidence_item = DisputeEvidence.objects.create(
            dispute=dispute,
            submitted_by_party=party,
            submitted_by=party.user,
            **validated_data,
        )

        AuditService.record(
            actor=party.user,
            category=AuditCategory.DISPUTE,
            action="dispute.evidence_added",
            resource=dispute,
            summary="Dispute evidence added.",
            metadata={
                "evidence_item_id": str(evidence_item.id),
            },
        )

        return evidence_item

    @staticmethod
    def _notify_dispute_opened(
        *,
        dispute,
        actor,
    ):
        if not dispute.transaction:
            return

        if dispute.opened_by_party_id == dispute.transaction.buyer_party_id:
            recipient_party = dispute.transaction.seller_party
        else:
            recipient_party = dispute.transaction.buyer_party

        from apps.notifications.models import NotificationType
        from apps.notifications.services import NotificationService

        NotificationService.notify_party(
            party=recipient_party,
            title="Dispute opened",
            message="A dispute has been opened on one of your transactions.",
            notification_type=NotificationType.DISPUTE,
            resource=dispute,
            payload={
                "transaction_id": str(dispute.transaction_id),
                "status": dispute.status,
                "priority": dispute.priority,
            },
            actor=actor,
        )
