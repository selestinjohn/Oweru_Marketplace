from rest_framework import serializers

from apps.authorization.services import AuthorizationService
from apps.transactions.models import TransactionStatus

from .models import (
    Dispute,
    DisputeEvidence,
    DisputeMessage,
)
from .policies import DisputePolicy


class DisputeMessageSerializer(serializers.ModelSerializer):

    class Meta:
        model = DisputeMessage

        fields = [
            "id",
            "dispute",
            "author_party",
            "author",
            "message",
            "is_internal",
            "created_at",
            "updated_at",
        ]

        read_only_fields = fields


class DisputeEvidenceSerializer(serializers.ModelSerializer):

    class Meta:
        model = DisputeEvidence

        fields = [
            "id",
            "dispute",
            "document",
            "evidence",
            "submitted_by_party",
            "submitted_by",
            "title",
            "description",
            "created_at",
            "updated_at",
        ]

        read_only_fields = fields


class DisputeSerializer(serializers.ModelSerializer):
    messages = serializers.SerializerMethodField()
    evidence_items = DisputeEvidenceSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = Dispute

        fields = [
            "id",
            "transaction",
            "payment",
            "listing",
            "property",
            "opened_by_party",
            "opened_by",
            "assigned_to",
            "category",
            "priority",
            "status",
            "subject",
            "description",
            "resolution_summary",
            "resolved_by",
            "resolved_at",
            "closed_at",
            "messages",
            "evidence_items",
            "created_at",
            "updated_at",
        ]

        read_only_fields = fields

    def get_messages(
        self,
        obj,
    ):
        request = self.context.get(
            "request",
        )
        party = None
        if request:
            party = getattr(
                request.user,
                "party",
                None,
            )

        messages = obj.messages.all()
        if not (
            AuthorizationService.is_admin(
                party=party,
            )
            or DisputePolicy.can_review(
                party=party,
            )
        ):
            messages = messages.filter(
                is_internal=False,
            )

        return DisputeMessageSerializer(
            messages,
            many=True,
        ).data


class DisputeCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Dispute

        fields = [
            "transaction",
            "payment",
            "listing",
            "property",
            "category",
            "priority",
            "subject",
            "description",
        ]

    def validate(self, attrs):
        payment = attrs.get("payment")
        transaction = attrs.get("transaction")
        listing = attrs.get("listing")
        property_obj = attrs.get("property")

        if not any(
            [
                payment,
                transaction,
                listing,
                property_obj,
            ]
        ):
            raise serializers.ValidationError(
                "A dispute must reference a payment, transaction, "
                "listing, or property."
            )

        if payment:
            if (
                transaction
                and payment.transaction_id != transaction.id
            ):
                raise serializers.ValidationError(
                    "Payment does not belong to the selected transaction."
                )
            attrs["transaction"] = payment.transaction

        transaction = attrs.get("transaction")
        if transaction:
            attrs.setdefault(
                "listing",
                transaction.listing,
            )
            attrs.setdefault(
                "property",
                transaction.property,
            )

        listing = attrs.get("listing")
        property_obj = attrs.get("property")
        if listing and property_obj and listing.property_id != property_obj.id:
            raise serializers.ValidationError(
                "Listing does not belong to the selected property."
            )

        if listing:
            attrs.setdefault(
                "property",
                listing.property,
            )

        return attrs


class DisputeReviewSerializer(serializers.Serializer):
    notes = serializers.CharField(
        required=False,
        allow_blank=True,
    )


class DisputeResolveSerializer(serializers.Serializer):
    resolution_summary = serializers.CharField()
    next_transaction_status = serializers.ChoiceField(
        choices=[
            TransactionStatus.DOCUMENTATION,
            TransactionStatus.CANCELLED,
        ],
        required=False,
        allow_blank=True,
    )


class DisputeCloseSerializer(serializers.Serializer):
    notes = serializers.CharField(
        required=False,
        allow_blank=True,
    )


class DisputeMessageCreateSerializer(serializers.Serializer):
    message = serializers.CharField()
    is_internal = serializers.BooleanField(
        required=False,
        default=False,
    )


class DisputeEvidenceCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = DisputeEvidence

        fields = [
            "document",
            "evidence",
            "title",
            "description",
        ]

    def validate(self, attrs):
        if not any(
            [
                attrs.get("document"),
                attrs.get("evidence"),
                attrs.get("title"),
                attrs.get("description"),
            ]
        ):
            raise serializers.ValidationError(
                "Evidence must include a document, an evidence record, "
                "a title, or a description."
            )

        return attrs
