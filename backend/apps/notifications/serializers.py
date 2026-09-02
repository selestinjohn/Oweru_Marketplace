from rest_framework import serializers

from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    is_read = serializers.BooleanField(
        read_only=True,
    )
    is_archived = serializers.BooleanField(
        read_only=True,
    )

    class Meta:
        model = Notification

        fields = [
            "id",
            "recipient_user",
            "recipient_party",
            "notification_type",
            "title",
            "message",
            "resource_type",
            "resource_id",
            "payload",
            "read_at",
            "archived_at",
            "is_read",
            "is_archived",
            "created_at",
            "updated_at",
        ]

        read_only_fields = fields
