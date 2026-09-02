from rest_framework import serializers

from .models import (
    ChecklistItemStatus,
    Transaction,
    TransferChecklistItem,
)


class TransferChecklistItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = TransferChecklistItem

        fields = [
            "id",
            "title",
            "description",
            "responsible_party",
            "status",
            "due_at",
            "completed_at",
            "completed_by",
            "position",
            "created_at",
            "updated_at",
        ]

        read_only_fields = fields


class TransactionSerializer(serializers.ModelSerializer):
    checklist_items = TransferChecklistItemSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = Transaction

        fields = [
            "id",
            "offer",
            "listing",
            "property",
            "buyer_party",
            "seller_party",
            "agreed_amount",
            "currency",
            "status",
            "initiated_by",
            "initiated_at",
            "completed_at",
            "cancelled_at",
            "checklist_items",
            "created_at",
            "updated_at",
        ]

        read_only_fields = fields


class TransactionTimelineEntrySerializer(serializers.Serializer):
    id = serializers.CharField()
    type = serializers.CharField()
    title = serializers.CharField()
    summary = serializers.CharField(
        allow_blank=True,
    )
    category = serializers.CharField()
    resource_type = serializers.CharField(
        allow_blank=True,
    )
    resource_id = serializers.CharField(
        allow_blank=True,
    )
    actor = serializers.IntegerField(
        allow_null=True,
    )
    occurred_at = serializers.DateTimeField()
    before = serializers.JSONField()
    after = serializers.JSONField()
    metadata = serializers.JSONField()


class ChecklistItemTransitionSerializer(serializers.Serializer):
    status = serializers.ChoiceField(
        choices=ChecklistItemStatus.choices,
    )
    notes = serializers.CharField(
        required=False,
        allow_blank=True,
    )
