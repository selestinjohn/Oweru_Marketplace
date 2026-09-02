from django.conf import settings
from django.db import models

from apps.core.models import TimeStampedModel
from apps.properties.models import Property, SourceType


class DocumentStatus(models.TextChoices):
    SUBMITTED = "SUBMITTED", "Submitted"
    UNDER_REVIEW = "UNDER_REVIEW", "Under review"
    ACCEPTED = "ACCEPTED", "Accepted"
    REJECTED = "REJECTED", "Rejected"
    EXPIRED = "EXPIRED", "Expired"


class DocumentType(models.TextChoices):
    TITLE = "TITLE", "Title document"
    OWNERSHIP = "OWNERSHIP", "Ownership document"
    TAX = "TAX", "Tax document"
    IDENTITY = "IDENTITY", "Identity document"
    SURVEY = "SURVEY", "Survey document"
    OTHER = "OTHER", "Other"


class Document(TimeStampedModel):

    property = models.ForeignKey(
        Property,
        on_delete=models.PROTECT,
        related_name="documents",
    )

    document_type = models.CharField(
        max_length=30,
        choices=DocumentType.choices,
    )

    source_type = models.CharField(
        max_length=30,
        choices=SourceType.choices,
    )

    status = models.CharField(
        max_length=30,
        choices=DocumentStatus.choices,
        default=DocumentStatus.SUBMITTED,
    )

    file_reference = models.CharField(
        max_length=500,
    )

    description = models.TextField(
        blank=True,
    )

    sighted_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    issued_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    expires_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="uploaded_documents",
    )

    class Meta:
        indexes = [
            models.Index(
                fields=[
                    "property",
                    "status",
                ]
            ),
            models.Index(
                fields=[
                    "document_type",
                ]
            ),
        ]

class Evidence(TimeStampedModel):

    property = models.ForeignKey(
        Property,
        on_delete=models.PROTECT,
        related_name="evidence",
    )

    document = models.ForeignKey(
        Document,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="evidence_items",
    )

    source_type = models.CharField(
        max_length=30,
        choices=SourceType.choices,
    )

    title = models.CharField(
        max_length=255,
    )

    description = models.TextField(
        blank=True,
    )

    recorded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="recorded_evidence",
    )

    recorded_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:
        indexes = [
            models.Index(
                fields=[
                    "property",
                    "source_type",
                ]
            ),
            models.Index(
                fields=[
                    "recorded_at",
                ]
            ),
        ]

class DocumentReview(TimeStampedModel):

    document = models.ForeignKey(
        Document,
        on_delete=models.PROTECT,
        related_name="reviews",
    )

    reviewer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="document_reviews",
    )

    previous_status = models.CharField(
        max_length=30,
        choices=DocumentStatus.choices,
    )

    new_status = models.CharField(
        max_length=30,
        choices=DocumentStatus.choices,
    )

    reason = models.TextField(
        blank=True,
    )

    reviewed_at = models.DateTimeField(
        auto_now_add=True,
    )
