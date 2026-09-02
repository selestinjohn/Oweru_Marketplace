from rest_framework import serializers

from .models import Property


class PropertyCreateSerializer(
    serializers.ModelSerializer,
):

    class Meta:
        model = Property

        fields = [
            "reference_number",
            "project",
            "property_type",
            "ownership_basis",
            "description",
            "location_description",
            "latitude",
            "longitude",
        ]

        read_only_fields = [
            "status",
        ]




    def validate_latitude(self, value):

        if value is not None and not (
            -90 <= value <= 90
        ):
            raise serializers.ValidationError(
                "Latitude must be between -90 and 90."
            )

        return value




    def validate_longitude(self, value):

        if value is not None and not (
            -180 <= value <= 180
        ):
            raise serializers.ValidationError(
                "Longitude must be between -180 and 180."
            )

        return value



class PropertySerializer(
    serializers.ModelSerializer,
):

    class Meta:
        model = Property

        fields = [
            "id",
            "reference_number",
            "project",
            "property_type",
            "status",
            "ownership_basis",
            "description",
            "location_description",
            "latitude",
            "longitude",
            "created_at",
            "updated_at",
        ]

        read_only_fields = fields