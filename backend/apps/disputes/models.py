from django.conf import settings
from django.db import models

from apps.core.models import TimeStampedModel
from apps.documents.models import Document, Evidence
from apps.listings.models import Listing
from apps.parties.models import Party
from apps.payments.models import Payment
from apps.properties.models import Property
from apps.transactions.models import Transaction


class DisputeCategory(models.TextChoices):
    TRANSACTION = "TRANSACTION", "Transaction"
    PAYMENT = "PAYMENT", "Payment"
    VERIFICATION = "VERIFICATION", "Verification"
    DOCUMENT = "DOCUMENT", "Document"
    LISTING = "LISTING", "Listing"
    PROPERTY = "PROPERTY", "Property"
    OTHER = "OTHER", "Other"


class DisputePriority(models.TextChoices):
    LOW = "LOW", "Low"
    MEDIUM = "MEDIUM", "Medium"
    HIGH = "HIGH", "High"
    URGENT = "URGENT", "Urgent"


class DisputeStatus(models.TextChoices):
    OPEN = "OPEN", "Open"
    UNDER_REVIEW = "UNDER_REVIEW", "Under review"
    RESOLVED = "RESOLVED", "Resolved"
    CLOSED = "CLOSED", "Closed"
    CANCELLED = "CANCELLED", "Cancelled"


class Dispute(TimeStampedModel):
    transaction = models.ForeignKey(
        Transaction,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="disputes",
    )

    payment = models.ForeignKey(
        Payment,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="disputes",
    )

    listing = models.ForeignKey(
        Listing,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="disputes",
    )

    property = models.ForeignKey(
        Property,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="disputes",
    )

    opened_by_party = models.ForeignKey(
        Party,
        on_delete=models.PROTECT,
        related_name="opened_disputes",
    )

    opened_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="opened_disputes",
    )

    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="assigned_disputes",
    )

    category = models.CharField(
        max_length=30,
        choices=DisputeCategory.choices,
    )

    priority = models.CharField(
        max_length=20,
        choices=DisputePriority.choices,
        default=DisputePriority.MEDIUM,
    )

    status = models.CharField(
        max_length=30,
        choices=DisputeStatus.choices,
        default=DisputeStatus.OPEN,
    )

    subject = models.CharField(
        max_length=255,
    )

    description = models.TextField()

    resolution_summary = models.TextField(
        blank=True,
    )

    resolved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="resolved_disputes",
    )

    resolved_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    closed_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    class Meta:
        indexes = [
            models.Index(
                fields=[
                    "status",
                    "priority",
                ]
            ),
            models.Index(
                fields=[
                    "transaction",
                    "status",
                ]
            ),
            models.Index(
                fields=[
                    "payment",
                    "status",
                ]
            ),
            models.Index(
                fields=[
                    "property",
                    "status",
                ]
            ),
            models.Index(
                fields=[
                    "opened_by_party",
                    "status",
                ]
            ),
        ]
        ordering = [
            "-created_at",
        ]

    def __str__(self):
        return self.subject


class DisputeMessage(TimeStampedModel):
    dispute = models.ForeignKey(
        Dispute,
        on_delete=models.CASCADE,
        related_name="messages",
    )

    author_party = models.ForeignKey(
        Party,
        on_delete=models.PROTECT,
        related_name="dispute_messages",
    )

    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="dispute_messages",
    )

    message = models.TextField()

    is_internal = models.BooleanField(
        default=False,
    )

    class Meta:
        indexes = [
            models.Index(
                fields=[
                    "dispute",
                    "created_at",
                ]
            ),
            models.Index(
                fields=[
                    "author_party",
                    "created_at",
                ]
            ),
        ]
        ordering = [
            "created_at",
        ]

    def __str__(self):
        return f"Message for {self.dispute_id}"


class DisputeEvidence(TimeStampedModel):
    dispute = models.ForeignKey(
        Dispute,
        on_delete=models.CASCADE,
        related_name="evidence_items",
    )

    document = models.ForeignKey(
        Document,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="dispute_evidence_items",
    )

    evidence = models.ForeignKey(
        Evidence,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="dispute_evidence_items",
    )

    submitted_by_party = models.ForeignKey(
        Party,
        on_delete=models.PROTECT,
        related_name="submitted_dispute_evidence",
    )

    submitted_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="submitted_dispute_evidence",
    )

    title = models.CharField(
        max_length=255,
    )

    description = models.TextField(
        blank=True,
    )

    class Meta:
        indexes = [
            models.Index(
                fields=[
                    "dispute",
                    "created_at",
                ]
            ),
            models.Index(
                fields=[
                    "submitted_by_party",
                    "created_at",
                ]
            ),
        ]
        ordering = [
            "created_at",
        ]

    def __str__(self):
        return self.title
