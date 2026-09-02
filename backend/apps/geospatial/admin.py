from django.contrib import admin

from .models import PropertyBoundary, PropertyLocationRecord, SiteRisk


@admin.register(PropertyLocationRecord)
class PropertyLocationRecordAdmin(admin.ModelAdmin):
    list_display = [
        "property",
        "latitude",
        "longitude",
        "source_type",
        "is_primary",
        "captured_by",
        "created_at",
    ]
    list_filter = [
        "source_type",
        "is_primary",
    ]
    search_fields = [
        "property__reference_number",
        "notes",
    ]


@admin.register(PropertyBoundary)
class PropertyBoundaryAdmin(admin.ModelAdmin):
    list_display = [
        "property",
        "boundary_type",
        "source_type",
        "is_current",
        "captured_by",
        "created_at",
    ]
    list_filter = [
        "boundary_type",
        "source_type",
        "is_current",
    ]
    search_fields = [
        "property__reference_number",
        "notes",
    ]


@admin.register(SiteRisk)
class SiteRiskAdmin(admin.ModelAdmin):
    list_display = [
        "property",
        "risk_type",
        "severity",
        "recorded_by",
        "created_at",
    ]
    list_filter = [
        "risk_type",
        "severity",
        "source_type",
    ]
    search_fields = [
        "property__reference_number",
        "description",
        "mitigation_notes",
    ]
