from django.db import models
from apps.core.models import TimeStampedModel

from apps.properties.models import Property
from apps.parties.models import Party


class ListingStatus(models.TextChoices):
    DRAFT = "DRAFT", "Draft"
    PENDING_REVIEW = "PENDING_REVIEW", "Pending review"
    PUBLISHED = "PUBLISHED", "Published"
    PAUSED = "PAUSED", "Paused"
    SOLD = "SOLD", "Sold"
    CLOSED = "CLOSED", "Closed"


class Listing(TimeStampedModel):

    property = models.ForeignKey(
        Property,
        on_delete=models.PROTECT,
        related_name="listings",
    )

    title = models.CharField(
        max_length=255,
    )

    description = models.TextField()

    price = models.DecimalField(
        max_digits=15,
        decimal_places=2,
    )

    currency = models.CharField(
        max_length=3,
        default="TZS",
    )

    status = models.CharField(
        max_length=30,
        choices=ListingStatus.choices,
        default=ListingStatus.DRAFT,
    )

    is_promoted = models.BooleanField(
        default=False,
    )

    published_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    def __str__(self):
        return self.title





class ListingPartyRelationship(models.TextChoices):
    OWNER = "OWNER", "Owner"
    AGENT = "AGENT", "Agent"



class ListingParty(TimeStampedModel):

    listing = models.ForeignKey(
        Listing,
        on_delete=models.CASCADE,
        related_name="parties",
    )

    party = models.ForeignKey(
        Party,
        on_delete=models.PROTECT,
        related_name="listing_relationships",
    )

    relationship = models.CharField(
        max_length=20,
        choices=ListingPartyRelationship.choices,
    )

    is_active = models.BooleanField(
        default=True,
    )

    authorized_at = models.DateTimeField(
        auto_now_add=True,
    )

    ended_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["listing", "party", "relationship"],
                name="unique_listing_party_relationship",
            )
        ]
