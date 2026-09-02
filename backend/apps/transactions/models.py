from django.conf import settings
from django.db import models

from apps.core.models import TimeStampedModel
from apps.listings.models import Listing
from apps.offers.models import Offer
from apps.parties.models import Party
from apps.properties.models import Property


class TransactionStatus(models.TextChoices):
    INITIATED = "INITIATED", "Initiated"
    PENDING_PAYMENT = "PENDING_PAYMENT", "Pending payment"
    PAYMENT_PROCESSING = "PAYMENT_PROCESSING", "Payment processing"
    PAYMENT_COMPLETED = "PAYMENT_COMPLETED", "Payment completed"
    DOCUMENTATION = "DOCUMENTATION", "Documentation"
    COMPLETED = "COMPLETED", "Completed"
    CANCELLED = "CANCELLED", "Cancelled"
    DISPUTED = "DISPUTED", "Disputed"


class ChecklistItemStatus(models.TextChoices):
    PENDING = "PENDING", "Pending"
    IN_PROGRESS = "IN_PROGRESS", "In progress"
    COMPLETED = "COMPLETED", "Completed"
    WAIVED = "WAIVED", "Waived"


class Transaction(TimeStampedModel):
    offer = models.OneToOneField(
        Offer,
        on_delete=models.PROTECT,
        related_name="transaction",
    )

    listing = models.ForeignKey(
        Listing,
        on_delete=models.PROTECT,
        related_name="transactions",
    )

    property = models.ForeignKey(
        Property,
        on_delete=models.PROTECT,
        related_name="transactions",
    )

    buyer_party = models.ForeignKey(
        Party,
        on_delete=models.PROTECT,
        related_name="buyer_transactions",
    )

    seller_party = models.ForeignKey(
        Party,
        on_delete=models.PROTECT,
        related_name="seller_transactions",
    )

    agreed_amount = models.DecimalField(
        max_digits=15,
        decimal_places=2,
    )

    currency = models.CharField(
        max_length=3,
        default="TZS",
    )

    status = models.CharField(
        max_length=30,
        choices=TransactionStatus.choices,
        default=TransactionStatus.INITIATED,
    )

    initiated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="initiated_transactions",
    )

    initiated_at = models.DateTimeField(
        auto_now_add=True,
    )

    completed_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    cancelled_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    class Meta:
        indexes = [
            models.Index(
                fields=[
                    "status",
                    "created_at",
                ]
            ),
            models.Index(
                fields=[
                    "buyer_party",
                    "status",
                ]
            ),
            models.Index(
                fields=[
                    "seller_party",
                    "status",
                ]
            ),
            models.Index(
                fields=[
                    "property",
                    "status",
                ]
            ),
        ]
        ordering = [
            "-created_at",
        ]

    def __str__(self):
        return f"Transaction {self.id} for {self.property}"


class TransferChecklistItem(TimeStampedModel):
    transaction = models.ForeignKey(
        Transaction,
        on_delete=models.CASCADE,
        related_name="checklist_items",
    )

    title = models.CharField(
        max_length=255,
    )

    description = models.TextField(
        blank=True,
    )

    responsible_party = models.ForeignKey(
        Party,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="transaction_checklist_items",
    )

    status = models.CharField(
        max_length=30,
        choices=ChecklistItemStatus.choices,
        default=ChecklistItemStatus.PENDING,
    )

    due_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    completed_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    completed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="completed_transfer_checklist_items",
    )

    position = models.PositiveIntegerField(
        default=0,
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
                    "position",
                ]
            ),
        ]
        ordering = [
            "position",
            "created_at",
        ]

    def __str__(self):
        return self.title
