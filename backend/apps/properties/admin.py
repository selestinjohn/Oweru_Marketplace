from django.contrib import admin

from .models import (
    Project,
    Property,
    PropertyParty,
)


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "location_description",
        "created_at",
        "updated_at",
    )

    search_fields = (
        "name",
        "description",
        "location_description",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )

    ordering = (
        "-created_at",
    )


@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = (
        "reference_number",
        "property_type",
        "status",
        "project",
        "location_description",
        "latitude",
        "longitude",
        "created_at",
        "updated_at",
    )

    search_fields = (
        "reference_number",
        "ownership_basis",
        "description",
        "location_description",
        "project__name",
    )

    list_filter = (
        "property_type",
        "status",
        "project",
        "created_at",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )

    ordering = (
        "-created_at",
    )


@admin.register(PropertyParty)
class PropertyPartyAdmin(admin.ModelAdmin):
    list_display = (
        "property",
        "party",
        "relationship",
        "basis",
        "source_type",
        "started_at",
        "ended_at",
        "created_at",
    )

    search_fields = (
        "property__reference_number",
        "party__display_name",
        "basis",
    )

    list_filter = (
        "relationship",
        "source_type",
        "started_at",
        "ended_at",
        "created_at",
    )

    readonly_fields = (
        "created_at",
    )

    ordering = (
        "-created_at",
    )