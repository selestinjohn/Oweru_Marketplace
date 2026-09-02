from django.conf import settings
from django.db import models

from apps.core.models import TimeStampedModel


class AuditCategory(models.TextChoices):
    IDENTITY = "IDENTITY", "Identity"
    PARTY = "PARTY", "Party"
    PROPERTY = "PROPERTY", "Property"
    LISTING = "LISTING", "Listing"
    OFFER = "OFFER", "Offer"
    TRANSACTION = "TRANSACTION", "Transaction"
    PAYMENT = "PAYMENT", "Payment"
    DISPUTE = "DISPUTE", "Dispute"
    NOTIFICATION = "NOTIFICATION", "Notification"
    GEOSPATIAL = "GEOSPATIAL", "Geospatial"
    DUE_DILIGENCE = "DUE_DILIGENCE", "Due diligence"
    DOCUMENT = "DOCUMENT", "Document"
    VERIFICATION = "VERIFICATION", "Verification"
    AUTHORIZATION = "AUTHORIZATION", "Authorization"
    ADMINISTRATION = "ADMINISTRATION", "Administration"
    SYSTEM = "SYSTEM", "System"


class AuditEvent(TimeStampedModel):
    actor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="audit_events",
    )

    category = models.CharField(
        max_length=30,
        choices=AuditCategory.choices,
    )

    action = models.CharField(
        max_length=100,
    )

    resource_type = models.CharField(
        max_length=150,
        blank=True,
    )

    resource_id = models.CharField(
        max_length=100,
        blank=True,
    )

    summary = models.CharField(
        max_length=255,
        blank=True,
    )

    before = models.JSONField(
        default=dict,
        blank=True,
    )

    after = models.JSONField(
        default=dict,
        blank=True,
    )

    metadata = models.JSONField(
        default=dict,
        blank=True,
    )

    ip_address = models.GenericIPAddressField(
        null=True,
        blank=True,
    )

    user_agent = models.TextField(
        blank=True,
    )

    occurred_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:
        indexes = [
            models.Index(
                fields=[
                    "category",
                    "action",
                ]
            ),
            models.Index(
                fields=[
                    "resource_type",
                    "resource_id",
                ]
            ),
            models.Index(
                fields=[
                    "actor",
                    "occurred_at",
                ]
            ),
            models.Index(
                fields=[
                    "occurred_at",
                ]
            ),
        ]
        ordering = [
            "-occurred_at",
        ]

    def __str__(self):
        return f"{self.action} on {self.resource_type}:{self.resource_id}"
