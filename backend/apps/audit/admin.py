from django.contrib import admin

from .models import AuditEvent


@admin.register(AuditEvent)
class AuditEventAdmin(admin.ModelAdmin):
    list_display = (
        "occurred_at",
        "category",
        "action",
        "actor",
        "resource_type",
        "resource_id",
    )

    search_fields = (
        "action",
        "summary",
        "resource_type",
        "resource_id",
        "actor__email",
        "actor__phone_number",
    )

    list_filter = (
        "category",
        "action",
        "occurred_at",
    )

    readonly_fields = (
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
    )

    ordering = (
        "-occurred_at",
    )
