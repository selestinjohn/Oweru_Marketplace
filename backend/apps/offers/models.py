from django.conf import settings
from django.db import models

from apps.core.models import TimeStampedModel
from apps.listings.models import Listing
from apps.parties.models import Party


class OfferStatus(models.TextChoices):
    PENDING = "PENDING", "Pending"
    COUNTERED = "COUNTERED", "Countered"
    ACCEPTED = "ACCEPTED", "Accepted"
    REJECTED = "REJECTED", "Rejected"
    WITHDRAWN = "WITHDRAWN", "Withdrawn"
    EXPIRED = "EXPIRED", "Expired"


class OfferEventType(models.TextChoices):
    CREATED = "CREATED", "Created"
    COUNTERED = "COUNTERED", "Countered"
    ACCEPTED = "ACCEPTED", "Accepted"
    REJECTED = "REJECTED", "Rejected"
    WITHDRAWN = "WITHDRAWN", "Withdrawn"
    EXPIRED = "EXPIRED", "Expired"


class Offer(TimeStampedModel):
    listing = models.ForeignKey(
        Listing,
        on_delete=models.PROTECT,
        related_name="offers",
    )

    buyer_party = models.ForeignKey(
        Party,
        on_delete=models.PROTECT,
        related_name="buyer_offers",
    )

    amount = models.DecimalField(
        max_digits=15,
        decimal_places=2,
    )

    currency = models.CharField(
        max_length=3,
        default="TZS",
    )

    message = models.TextField(
        blank=True,
    )

    status = models.CharField(
        max_length=30,
        choices=OfferStatus.choices,
        default=OfferStatus.PENDING,
    )

    expires_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    responded_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    responded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="responded_offers",
    )

    withdrawn_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="created_offers",
    )

    class Meta:
        indexes = [
            models.Index(
                fields=[
                    "listing",
                    "status",
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
                    "expires_at",
                ]
            ),
        ]
        ordering = [
            "-created_at",
        ]

    def __str__(self):
        return f"{self.amount} {self.currency} for {self.listing}"


class OfferEvent(TimeStampedModel):
    offer = models.ForeignKey(
        Offer,
        on_delete=models.CASCADE,
        related_name="events",
    )

    actor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="offer_events",
    )

    event_type = models.CharField(
        max_length=30,
        choices=OfferEventType.choices,
    )

    amount = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        null=True,
        blank=True,
    )

    currency = models.CharField(
        max_length=3,
        blank=True,
    )

    message = models.TextField(
        blank=True,
    )

    occurred_at = models.DateTimeField(
        auto_now_add=True,
    )

    metadata = models.JSONField(
        default=dict,
        blank=True,
    )

    class Meta:
        indexes = [
            models.Index(
                fields=[
                    "offer",
                    "event_type",
                ]
            ),
            models.Index(
                fields=[
                    "occurred_at",
                ]
            ),
        ]
        ordering = [
            "occurred_at",
        ]

    def __str__(self):
        return f"{self.event_type} for {self.offer_id}"
