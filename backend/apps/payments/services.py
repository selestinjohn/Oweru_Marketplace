from django.db import transaction
from django.utils import timezone

from apps.audit.models import AuditCategory
from apps.audit.services import AuditService
from apps.authorization.exceptions import AuthorizationDenied
from apps.transactions.models import TransactionStatus
from apps.transactions.services import TransactionService

from .models import Payment, PaymentStatus, Receipt
from .policies import PaymentPolicy


class PaymentService:

    @staticmethod
    @transaction.atomic
    def create_payment(
        *,
        party,
        transaction_obj,
        validated_data,
    ):
        if not PaymentPolicy.can_create(
            party=party,
            transaction=transaction_obj,
        ):
            raise AuthorizationDenied()

        payment = Payment.objects.create(
            transaction=transaction_obj,
            payer_party=party,
            initiated_by=party.user,
            **validated_data,
        )

        if transaction_obj.status == TransactionStatus.INITIATED:
            TransactionService.transition_system(
                transaction_obj=transaction_obj,
                new_status=TransactionStatus.PENDING_PAYMENT,
                actor=party.user,
                notes="Payment record initiated.",
            )

        AuditService.record(
            actor=party.user,
            category=AuditCategory.PAYMENT,
            action="payment.created",
            resource=payment,
            summary="Payment record created.",
            after={
                "transaction_id": str(transaction_obj.id),
                "amount": str(payment.amount),
                "currency": payment.currency,
                "purpose": payment.purpose,
                "status": payment.status,
            },
        )

        return payment

    @staticmethod
    @transaction.atomic
    def confirm_payment(
        *,
        party,
        payment,
        external_reference="",
        notes="",
    ):
        if not PaymentPolicy.can_manage(
            party=party,
            payment=payment,
        ):
            raise AuthorizationDenied()

        if payment.status not in {
            PaymentStatus.INITIATED,
            PaymentStatus.PROCESSING,
        }:
            raise ValueError(
                "Only initiated or processing payments can be confirmed."
            )

        previous_status = payment.status
        payment.status = PaymentStatus.CONFIRMED
        payment.confirmed_by = party.user
        payment.confirmed_at = timezone.now()
        if external_reference:
            payment.external_reference = external_reference
        if notes:
            payment.notes = notes
        payment.save(
            update_fields=[
                "status",
                "confirmed_by",
                "confirmed_at",
                "external_reference",
                "notes",
                "updated_at",
            ]
        )

        receipt = PaymentService._create_receipt(
            payment=payment,
            issued_by=party.user,
            notes=notes,
        )

        if payment.transaction.status in {
            TransactionStatus.PENDING_PAYMENT,
            TransactionStatus.PAYMENT_PROCESSING,
        }:
            TransactionService.transition_system(
                transaction_obj=payment.transaction,
                new_status=TransactionStatus.PAYMENT_COMPLETED,
                actor=party.user,
                notes="Payment confirmed.",
            )

        AuditService.record(
            actor=party.user,
            category=AuditCategory.PAYMENT,
            action="payment.confirmed",
            resource=payment,
            summary="Payment confirmed and receipt issued.",
            before={
                "status": previous_status,
            },
            after={
                "status": payment.status,
                "receipt_number": receipt.receipt_number,
            },
            metadata={
                "notes": notes,
            },
        )

        from apps.notifications.models import NotificationType
        from apps.notifications.services import NotificationService

        NotificationService.notify_party(
            party=payment.payer_party,
            title="Payment confirmed",
            message=(
                "Your payment record has been confirmed and a receipt "
                "has been issued."
            ),
            notification_type=NotificationType.PAYMENT,
            resource=payment,
            payload={
                "receipt_number": receipt.receipt_number,
                "transaction_id": str(payment.transaction_id),
            },
            actor=party.user,
        )

        return payment

    @staticmethod
    @transaction.atomic
    def fail_payment(
        *,
        party,
        payment,
        external_reference="",
        notes="",
    ):
        if not PaymentPolicy.can_manage(
            party=party,
            payment=payment,
        ):
            raise AuthorizationDenied()

        if payment.status not in {
            PaymentStatus.INITIATED,
            PaymentStatus.PROCESSING,
        }:
            raise ValueError(
                "Only initiated or processing payments can fail."
            )

        previous_status = payment.status
        payment.status = PaymentStatus.FAILED
        payment.failed_at = timezone.now()
        if external_reference:
            payment.external_reference = external_reference
        if notes:
            payment.notes = notes
        payment.save(
            update_fields=[
                "status",
                "failed_at",
                "external_reference",
                "notes",
                "updated_at",
            ]
        )

        AuditService.record(
            actor=party.user,
            category=AuditCategory.PAYMENT,
            action="payment.failed",
            resource=payment,
            summary="Payment marked failed.",
            before={
                "status": previous_status,
            },
            after={
                "status": payment.status,
            },
            metadata={
                "notes": notes,
            },
        )

        return payment

    @staticmethod
    @transaction.atomic
    def refund_payment(
        *,
        party,
        payment,
        external_reference="",
        notes="",
    ):
        if not PaymentPolicy.can_manage(
            party=party,
            payment=payment,
        ):
            raise AuthorizationDenied()

        if payment.status != PaymentStatus.CONFIRMED:
            raise ValueError(
                "Only confirmed payments can be refunded."
            )

        previous_status = payment.status
        payment.status = PaymentStatus.REFUNDED
        payment.refunded_at = timezone.now()
        if external_reference:
            payment.external_reference = external_reference
        if notes:
            payment.notes = notes
        payment.save(
            update_fields=[
                "status",
                "refunded_at",
                "external_reference",
                "notes",
                "updated_at",
            ]
        )

        AuditService.record(
            actor=party.user,
            category=AuditCategory.PAYMENT,
            action="payment.refunded",
            resource=payment,
            summary="Payment refunded.",
            before={
                "status": previous_status,
            },
            after={
                "status": payment.status,
            },
            metadata={
                "notes": notes,
            },
        )

        return payment

    @staticmethod
    def _create_receipt(
        *,
        payment,
        issued_by,
        notes="",
    ):
        receipt_number = f"OWERU-RCPT-{payment.id.hex[:12].upper()}"

        receipt, _ = Receipt.objects.get_or_create(
            payment=payment,
            defaults={
                "receipt_number": receipt_number,
                "issued_to": payment.payer_party,
                "issued_by": issued_by,
                "notes": notes,
            },
        )

        return receipt
