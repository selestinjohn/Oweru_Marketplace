from django.conf import settings
from django.db import models

from apps.core.models import TimeStampedModel
from apps.parties.models import Party
from apps.transactions.models import Transaction


class PaymentPurpose(models.TextChoices):
    VERIFICATION_FEE = "VERIFICATION_FEE", "Verification fee"
    DUE_DILIGENCE_FEE = "DUE_DILIGENCE_FEE", "Due diligence fee"
    PROFESSIONAL_FEE = "PROFESSIONAL_FEE", "Professional fee"
    RESERVATION_FEE = "RESERVATION_FEE", "Reservation fee"
    TRANSACTION_SUPPORT_FEE = "TRANSACTION_SUPPORT_FEE", "Transaction support fee"
    PURCHASE_PRICE_RECORD = "PURCHASE_PRICE_RECORD", "Purchase price record"
    OTHER = "OTHER", "Other"


class PaymentStatus(models.TextChoices):
    INITIATED = "INITIATED", "Initiated"
    PROCESSING = "PROCESSING", "Processing"
    CONFIRMED = "CONFIRMED", "Confirmed"
    FAILED = "FAILED", "Failed"
    REFUNDED = "REFUNDED", "Refunded"
    CANCELLED = "CANCELLED", "Cancelled"


class PaymentMethod(models.TextChoices):
    CASH = "CASH", "Cash"
    BANK_TRANSFER = "BANK_TRANSFER", "Bank transfer"
    MOBILE_MONEY = "MOBILE_MONEY", "Mobile money"
    GATEWAY = "GATEWAY", "Gateway"
    OTHER = "OTHER", "Other"


class Payment(TimeStampedModel):
    transaction = models.ForeignKey(
        Transaction,
        on_delete=models.PROTECT,
        related_name="payments",
    )

    payer_party = models.ForeignKey(
        Party,
        on_delete=models.PROTECT,
        related_name="payments_made",
    )

    payee_party = models.ForeignKey(
        Party,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="payments_received",
    )

    purpose = models.CharField(
        max_length=40,
        choices=PaymentPurpose.choices,
    )

    amount = models.DecimalField(
        max_digits=15,
        decimal_places=2,
    )

    currency = models.CharField(
        max_length=3,
        default="TZS",
    )

    method = models.CharField(
        max_length=30,
        choices=PaymentMethod.choices,
        default=PaymentMethod.OTHER,
    )

    status = models.CharField(
        max_length=30,
        choices=PaymentStatus.choices,
        default=PaymentStatus.INITIATED,
    )

    external_reference = models.CharField(
        max_length=150,
        blank=True,
    )

    notes = models.TextField(
        blank=True,
    )

    initiated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="initiated_payments",
    )

    confirmed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="confirmed_payments",
    )

    confirmed_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    failed_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    refunded_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    class Meta:
        indexes = [
            models.Index(
                fields=[
                    "transaction",
                    "status",
                ]
            ),
            models.Index(
                fields=[
                    "payer_party",
                    "status",
                ]
            ),
            models.Index(
                fields=[
                    "purpose",
                    "status",
                ]
            ),
            models.Index(
                fields=[
                    "external_reference",
                ]
            ),
        ]
        ordering = [
            "-created_at",
        ]

    def __str__(self):
        return f"{self.amount} {self.currency} {self.purpose}"


class Receipt(TimeStampedModel):
    payment = models.OneToOneField(
        Payment,
        on_delete=models.PROTECT,
        related_name="receipt",
    )

    receipt_number = models.CharField(
        max_length=50,
        unique=True,
    )

    issued_to = models.ForeignKey(
        Party,
        on_delete=models.PROTECT,
        related_name="receipts",
    )

    issued_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="issued_receipts",
    )

    issued_at = models.DateTimeField(
        auto_now_add=True,
    )

    notes = models.TextField(
        blank=True,
    )

    class Meta:
        indexes = [
            models.Index(
                fields=[
                    "receipt_number",
                ]
            ),
            models.Index(
                fields=[
                    "issued_to",
                    "issued_at",
                ]
            ),
        ]
        ordering = [
            "-issued_at",
        ]

    def __str__(self):
        return self.receipt_number
