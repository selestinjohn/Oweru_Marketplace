from rest_framework import serializers

from .models import Payment, Receipt


class ReceiptSerializer(serializers.ModelSerializer):

    class Meta:
        model = Receipt

        fields = [
            "id",
            "payment",
            "receipt_number",
            "issued_to",
            "issued_by",
            "issued_at",
            "notes",
            "created_at",
            "updated_at",
        ]

        read_only_fields = fields


class PaymentSerializer(serializers.ModelSerializer):
    receipt = ReceiptSerializer(
        read_only=True,
    )

    class Meta:
        model = Payment

        fields = [
            "id",
            "transaction",
            "payer_party",
            "payee_party",
            "purpose",
            "amount",
            "currency",
            "method",
            "status",
            "external_reference",
            "notes",
            "initiated_by",
            "confirmed_by",
            "confirmed_at",
            "failed_at",
            "refunded_at",
            "receipt",
            "created_at",
            "updated_at",
        ]

        read_only_fields = fields


class PaymentCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Payment

        fields = [
            "transaction",
            "payee_party",
            "purpose",
            "amount",
            "currency",
            "method",
            "external_reference",
            "notes",
        ]

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "Payment amount must be greater than zero."
            )

        return value


class PaymentActionSerializer(serializers.Serializer):
    external_reference = serializers.CharField(
        required=False,
        allow_blank=True,
        max_length=150,
    )
    notes = serializers.CharField(
        required=False,
        allow_blank=True,
    )
