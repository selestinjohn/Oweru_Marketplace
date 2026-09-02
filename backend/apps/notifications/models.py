from django.conf import settings
from django.db import models

from apps.core.models import TimeStampedModel
from apps.parties.models import Party


class NotificationType(models.TextChoices):
    OFFER = "OFFER", "Offer"
    PAYMENT = "PAYMENT", "Payment"
    TRANSACTION = "TRANSACTION", "Transaction"
    DISPUTE = "DISPUTE", "Dispute"
    VERIFICATION = "VERIFICATION", "Verification"
    DOCUMENT = "DOCUMENT", "Document"
    DUE_DILIGENCE = "DUE_DILIGENCE", "Due diligence"
    GEOSPATIAL = "GEOSPATIAL", "Geospatial"
    SYSTEM = "SYSTEM", "System"


class Notification(TimeStampedModel):
    recipient_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notifications",
    )

    recipient_party = models.ForeignKey(
        Party,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="notifications",
    )

    notification_type = models.CharField(
        max_length=30,
        choices=NotificationType.choices,
        default=NotificationType.SYSTEM,
    )

    title = models.CharField(
        max_length=150,
    )

    message = models.TextField()

    resource_type = models.CharField(
        max_length=150,
        blank=True,
    )

    resource_id = models.CharField(
        max_length=100,
        blank=True,
    )

    payload = models.JSONField(
        default=dict,
        blank=True,
    )

    read_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    archived_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    class Meta:
        indexes = [
            models.Index(
                fields=[
                    "recipient_user",
                    "read_at",
                    "created_at",
                ]
            ),
            models.Index(
                fields=[
                    "recipient_party",
                    "read_at",
                ]
            ),
            models.Index(
                fields=[
                    "notification_type",
                    "resource_type",
                    "resource_id",
                ]
            ),
            models.Index(
                fields=[
                    "archived_at",
                ]
            ),
        ]
        ordering = [
            "-created_at",
        ]

    @property
    def is_read(self):
        return self.read_at is not None

    @property
    def is_archived(self):
        return self.archived_at is not None

    def __str__(self):
        return self.title
