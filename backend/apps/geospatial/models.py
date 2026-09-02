from django.conf import settings
from django.db import models

from apps.core.models import TimeStampedModel
from apps.properties.models import Property, SourceType


class BoundaryType(models.TextChoices):
    PARCEL = "PARCEL", "Parcel"
    BUILDING_FOOTPRINT = "BUILDING_FOOTPRINT", "Building footprint"
    ACCESS_PATH = "ACCESS_PATH", "Access path"
    OTHER = "OTHER", "Other"


class GeoRiskType(models.TextChoices):
    BOUNDARY_CONFLICT = "BOUNDARY_CONFLICT", "Boundary conflict"
    ENCROACHMENT = "ENCROACHMENT", "Encroachment"
    FLOOD = "FLOOD", "Flood"
    ACCESS = "ACCESS", "Access"
    UTILITY = "UTILITY", "Utility"
    ZONING = "ZONING", "Zoning"
    ENVIRONMENTAL = "ENVIRONMENTAL", "Environmental"
    OTHER = "OTHER", "Other"


class GeoRiskSeverity(models.TextChoices):
    LOW = "LOW", "Low"
    MEDIUM = "MEDIUM", "Medium"
    HIGH = "HIGH", "High"
    CRITICAL = "CRITICAL", "Critical"


class PropertyLocationRecord(TimeStampedModel):
    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name="location_records",
    )

    latitude = models.DecimalField(
        max_digits=10,
        decimal_places=7,
    )

    longitude = models.DecimalField(
        max_digits=10,
        decimal_places=7,
    )

    accuracy_meters = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
    )

    source_type = models.CharField(
        max_length=30,
        choices=SourceType.choices,
    )

    captured_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="captured_location_records",
    )

    is_primary = models.BooleanField(
        default=False,
    )

    notes = models.TextField(
        blank=True,
    )

    class Meta:
        indexes = [
            models.Index(
                fields=[
                    "property",
                    "is_primary",
                ]
            ),
            models.Index(
                fields=[
                    "captured_by",
                    "created_at",
                ]
            ),
        ]
        ordering = [
            "-created_at",
        ]

    def __str__(self):
        return f"{self.latitude}, {self.longitude}"


class PropertyBoundary(TimeStampedModel):
    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name="boundaries",
    )

    boundary_type = models.CharField(
        max_length=30,
        choices=BoundaryType.choices,
        default=BoundaryType.PARCEL,
    )

    source_type = models.CharField(
        max_length=30,
        choices=SourceType.choices,
    )

    coordinates = models.JSONField(
        default=list,
    )

    centroid_latitude = models.DecimalField(
        max_digits=10,
        decimal_places=7,
        null=True,
        blank=True,
    )

    centroid_longitude = models.DecimalField(
        max_digits=10,
        decimal_places=7,
        null=True,
        blank=True,
    )

    area_square_meters = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        null=True,
        blank=True,
    )

    area_variance_percent = models.DecimalField(
        max_digits=7,
        decimal_places=2,
        null=True,
        blank=True,
    )

    captured_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="captured_property_boundaries",
    )

    is_current = models.BooleanField(
        default=True,
    )

    verified_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    notes = models.TextField(
        blank=True,
    )

    class Meta:
        indexes = [
            models.Index(
                fields=[
                    "property",
                    "is_current",
                ]
            ),
            models.Index(
                fields=[
                    "boundary_type",
                    "source_type",
                ]
            ),
            models.Index(
                fields=[
                    "captured_by",
                    "created_at",
                ]
            ),
        ]
        ordering = [
            "-created_at",
        ]

    def __str__(self):
        return f"{self.property} {self.boundary_type}"


class SiteRisk(TimeStampedModel):
    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name="site_risks",
    )

    risk_type = models.CharField(
        max_length=30,
        choices=GeoRiskType.choices,
    )

    severity = models.CharField(
        max_length=20,
        choices=GeoRiskSeverity.choices,
        default=GeoRiskSeverity.MEDIUM,
    )

    source_type = models.CharField(
        max_length=30,
        choices=SourceType.choices,
    )

    description = models.TextField()

    mitigation_notes = models.TextField(
        blank=True,
    )

    recorded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="recorded_site_risks",
    )

    resolved_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    class Meta:
        indexes = [
            models.Index(
                fields=[
                    "property",
                    "severity",
                ]
            ),
            models.Index(
                fields=[
                    "risk_type",
                    "severity",
                ]
            ),
            models.Index(
                fields=[
                    "recorded_by",
                    "created_at",
                ]
            ),
        ]
        ordering = [
            "-created_at",
        ]

    def __str__(self):
        return f"{self.risk_type} ({self.severity})"
