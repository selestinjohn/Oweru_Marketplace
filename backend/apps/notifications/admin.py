from django.contrib import admin

from .models import Notification


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = [
        "title",
        "recipient_user",
        "notification_type",
        "read_at",
        "archived_at",
        "created_at",
    ]
    list_filter = [
        "notification_type",
        "read_at",
        "archived_at",
    ]
    search_fields = [
        "title",
        "message",
        "resource_type",
        "resource_id",
    ]
