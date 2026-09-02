from django.db import models
from apps.core.models import TimeStampedModel

class SourceType(models.TextChoices):
    OWERU_ESTABLISHED = (
        "OWERU_ESTABLISHED",
        "Established by Oweru",
    )

    USER_SUPPLIED = (
        "USER_SUPPLIED",
        "Supplied by user",
    )

    AUTHORITY_OBTAINED = (
        "AUTHORITY_OBTAINED",
        "Obtained from authority",
    )

class PropertyType(models.TextChoices):
    LAND = "LAND", "Land"
    HOUSE = "HOUSE", "House"
    APARTMENT = "APARTMENT", "Apartment"
    COMMERCIAL = "COMMERCIAL", "Commercial"
    OFFICE = "OFFICE", "Office"
    FARM = "FARM", "Farm"
    OTHER = "OTHER", "Other"

class PropertyStatus(models.TextChoices):
    DRAFT = "DRAFT", "Draft"
    AVAILABLE = "AVAILABLE", "Available"
    UNDER_OFFER = "UNDER_OFFER", "Under offer"
    SOLD = "SOLD", "Sold"
    RENTED = "RENTED", "Rented"
    RESERVED = "RESERVED", "Reserved"
    INACTIVE = "INACTIVE", "Inactive"

class Project(TimeStampedModel):

    name = models.CharField(
        max_length=255,
    )

    description = models.TextField(
        blank=True,
    )

    location_description = models.CharField(
        max_length=500,
        blank=True,
    )

    def __str__(self):
        return self.name


class Property(TimeStampedModel):

    reference_number = models.CharField(
        max_length=100,
        unique=True,
    )

    project = models.ForeignKey(
        Project,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="properties",
    )

    property_type = models.CharField(
        max_length=30,
        choices=PropertyType.choices,
    )

    status = models.CharField(
        max_length=30,
        choices=PropertyStatus.choices,
        default=PropertyStatus.DRAFT,
    )

    ownership_basis = models.CharField(
        max_length=255,
        blank=True,
    )

    description = models.TextField(
        blank=True,
    )

    location_description = models.CharField(
        max_length=500,
        blank=True,
    )

    latitude = models.DecimalField(
        max_digits=10,
        decimal_places=7,
        null=True,
        blank=True,
    )

    longitude = models.DecimalField(
        max_digits=10,
        decimal_places=7,
        null=True,
        blank=True,
    )

    def __str__(self):
        return self.reference_number





class PropertyPartyRole(models.TextChoices):
    OWNER = "OWNER", "Owner"
    CLAIMANT = "CLAIMANT", "Claimant"
    SELLER = "SELLER", "Seller"
    MANAGER = "MANAGER", "Manager"



class PropertyParty(TimeStampedModel):

    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name="parties",
    )

    party = models.ForeignKey(
        "parties.Party",
        on_delete=models.PROTECT,
        related_name="property_relationships",
    )

    relationship = models.CharField(
        max_length=30,
        choices=PropertyPartyRole.choices,
    )

    basis = models.CharField(
        max_length=255,
        blank=True,
    )

    source_type = models.CharField(
        max_length=30,
        choices=SourceType.choices,
    )

    started_at = models.DateTimeField()

    ended_at = models.DateTimeField(
        null=True,
        blank=True,
    )
