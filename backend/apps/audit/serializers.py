from rest_framework import serializers

from .models import AuditEvent


class AuditEventSerializer(serializers.ModelSerializer):

    class Meta:
        model = AuditEvent

        fields = [
            "id",
            "actor",
            "category",
            "action",
            "resource_type",
            "resource_id",
            "summary",
            "before",
            "after",
            "metadata",
            "ip_address",
            "user_agent",
            "occurred_at",
            "created_at",
            "updated_at",
        ]

        read_only_fields = fields
