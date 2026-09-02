from rest_framework import serializers

from .models import Offer, OfferEvent


class OfferEventSerializer(serializers.ModelSerializer):

    class Meta:
        model = OfferEvent

        fields = [
            "id",
            "event_type",
            "actor",
            "amount",
            "currency",
            "message",
            "metadata",
            "occurred_at",
            "created_at",
            "updated_at",
        ]

        read_only_fields = fields


class OfferSerializer(serializers.ModelSerializer):
    events = OfferEventSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = Offer

        fields = [
            "id",
            "listing",
            "buyer_party",
            "amount",
            "currency",
            "message",
            "status",
            "expires_at",
            "responded_at",
            "responded_by",
            "withdrawn_at",
            "created_by",
            "events",
            "created_at",
            "updated_at",
        ]

        read_only_fields = fields


class OfferCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Offer

        fields = [
            "listing",
            "amount",
            "currency",
            "message",
            "expires_at",
        ]

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "Offer amount must be greater than zero."
            )

        return value


class OfferMessageSerializer(serializers.Serializer):
    message = serializers.CharField(
        required=False,
        allow_blank=True,
    )


class OfferCounterSerializer(OfferMessageSerializer):
    amount = serializers.DecimalField(
        max_digits=15,
        decimal_places=2,
    )

    currency = serializers.CharField(
        max_length=3,
        required=False,
        default="TZS",
    )

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "Counter-offer amount must be greater than zero."
            )

        return value
