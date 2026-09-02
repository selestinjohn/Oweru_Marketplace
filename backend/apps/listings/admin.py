from django.contrib import admin

from .models import Listing, ListingParty


@admin.register(Listing)
class ListingAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "property",
        "price",
        "currency",
        "status",
        "is_promoted",
        "published_at",
        "created_at",
        "updated_at",
    )

    search_fields = (
        "title",
        "description",
        "property__id",
    )

    list_filter = (
        "status",
        "is_promoted",
        "currency",
        "created_at",
        "published_at",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )

    ordering = (
        "-created_at",
    )


@admin.register(ListingParty)
class ListingPartyAdmin(admin.ModelAdmin):
    list_display = (
        "listing",
        "party",
        "relationship",
        "is_active",
        "authorized_at",
        "ended_at",
    )

    search_fields = (
        "listing__title",
        "party__display_name",
    )

    list_filter = (
        "relationship",
        "is_active",
        "authorized_at",
        "ended_at",
    )

    readonly_fields = (
        "authorized_at",
    )

    ordering = (
        "-authorized_at",
    )