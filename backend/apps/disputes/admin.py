from django.contrib import admin

from .models import Dispute, DisputeEvidence, DisputeMessage


class DisputeMessageInline(admin.TabularInline):
    model = DisputeMessage
    extra = 0


class DisputeEvidenceInline(admin.TabularInline):
    model = DisputeEvidence
    extra = 0


@admin.register(Dispute)
class DisputeAdmin(admin.ModelAdmin):
    list_display = [
        "subject",
        "category",
        "priority",
        "status",
        "opened_by_party",
        "assigned_to",
        "created_at",
    ]
    list_filter = [
        "category",
        "priority",
        "status",
    ]
    search_fields = [
        "subject",
        "description",
        "resolution_summary",
    ]
    inlines = [
        DisputeMessageInline,
        DisputeEvidenceInline,
    ]


@admin.register(DisputeMessage)
class DisputeMessageAdmin(admin.ModelAdmin):
    list_display = [
        "dispute",
        "author_party",
        "is_internal",
        "created_at",
    ]
    list_filter = [
        "is_internal",
    ]


@admin.register(DisputeEvidence)
class DisputeEvidenceAdmin(admin.ModelAdmin):
    list_display = [
        "title",
        "dispute",
        "submitted_by_party",
        "created_at",
    ]
    search_fields = [
        "title",
        "description",
    ]
