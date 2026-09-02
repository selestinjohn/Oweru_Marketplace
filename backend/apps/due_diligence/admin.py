from django.contrib import admin

from .models import (
    DueDiligenceFinding,
    DueDiligenceRequest,
    RiskReport,
)


class DueDiligenceFindingInline(admin.TabularInline):
    model = DueDiligenceFinding
    extra = 0


@admin.register(DueDiligenceRequest)
class DueDiligenceRequestAdmin(admin.ModelAdmin):
    list_display = [
        "property",
        "transaction",
        "status",
        "requested_by_party",
        "assigned_reviewer",
        "created_at",
    ]
    list_filter = [
        "status",
    ]
    search_fields = [
        "property__reference_number",
        "notes",
        "decision_notes",
    ]
    inlines = [
        DueDiligenceFindingInline,
    ]


@admin.register(RiskReport)
class RiskReportAdmin(admin.ModelAdmin):
    list_display = [
        "due_diligence_request",
        "outcome",
        "prepared_by",
        "issued_at",
        "expires_at",
    ]
    list_filter = [
        "outcome",
        "issued_at",
    ]
    search_fields = [
        "summary",
        "title_summary",
        "geospatial_summary",
        "payment_summary",
    ]


@admin.register(DueDiligenceFinding)
class DueDiligenceFindingAdmin(admin.ModelAdmin):
    list_display = [
        "title",
        "due_diligence_request",
        "category",
        "severity",
        "recorded_by",
        "created_at",
    ]
    list_filter = [
        "category",
        "severity",
    ]
    search_fields = [
        "title",
        "description",
        "recommendation",
    ]
