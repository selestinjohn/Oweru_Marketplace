from decimal import Decimal, InvalidOperation

from rest_framework import serializers

from .models import (
    PropertyBoundary,
    PropertyLocationRecord,
    SiteRisk,
)


def validate_coordinate(
    *,
    latitude,
    longitude,
):
    try:
        latitude = Decimal(str(latitude))
        longitude = Decimal(str(longitude))
    except (InvalidOperation, TypeError):
        raise serializers.ValidationError(
            "Latitude and longitude must be valid decimal values."
        )

    if latitude < Decimal("-90") or latitude > Decimal("90"):
        raise serializers.ValidationError(
            "Latitude must be between -90 and 90."
        )

    if longitude < Decimal("-180") or longitude > Decimal("180"):
        raise serializers.ValidationError(
            "Longitude must be between -180 and 180."
        )

    return latitude, longitude


class PropertyLocationRecordSerializer(serializers.ModelSerializer):

    class Meta:
        model = PropertyLocationRecord

        fields = [
            "id",
            "property",
            "latitude",
            "longitude",
            "accuracy_meters",
            "source_type",
            "captured_by",
            "is_primary",
            "notes",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "captured_by",
            "created_at",
            "updated_at",
        ]

    def validate(self, attrs):
        validate_coordinate(
            latitude=attrs.get("latitude"),
            longitude=attrs.get("longitude"),
        )

        return attrs


class PropertyBoundarySerializer(serializers.ModelSerializer):

    class Meta:
        model = PropertyBoundary

        fields = [
            "id",
            "property",
            "boundary_type",
            "source_type",
            "coordinates",
            "centroid_latitude",
            "centroid_longitude",
            "area_square_meters",
            "area_variance_percent",
            "captured_by",
            "is_current",
            "verified_at",
            "notes",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "centroid_latitude",
            "centroid_longitude",
            "captured_by",
            "created_at",
            "updated_at",
        ]

    def validate_coordinates(self, value):
        if not isinstance(
            value,
            list,
        ):
            raise serializers.ValidationError(
                "Coordinates must be a list of points."
            )

        if len(value) < 3:
            raise serializers.ValidationError(
                "A boundary must contain at least three points."
            )

        normalized = []
        for point in value:
            if isinstance(
                point,
                dict,
            ):
                latitude = point.get("latitude")
                longitude = point.get("longitude")
            elif (
                isinstance(
                    point,
                    list,
                )
                and len(point) == 2
            ):
                latitude, longitude = point
            else:
                raise serializers.ValidationError(
                    "Each point must include latitude and longitude."
                )

            latitude, longitude = validate_coordinate(
                latitude=latitude,
                longitude=longitude,
            )
            normalized.append(
                {
                    "latitude": float(latitude),
                    "longitude": float(longitude),
                }
            )

        return normalized


class SiteRiskSerializer(serializers.ModelSerializer):

    class Meta:
        model = SiteRisk

        fields = [
            "id",
            "property",
            "risk_type",
            "severity",
            "source_type",
            "description",
            "mitigation_notes",
            "recorded_by",
            "resolved_at",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "recorded_by",
            "resolved_at",
            "created_at",
            "updated_at",
        ]
