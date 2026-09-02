from django.contrib import admin

from .models import Offer, OfferEvent


class OfferEventInline(admin.TabularInline):
    model = OfferEvent
    extra = 0
    readonly_fields = (
        "event_type",
        "actor",
        "amount",
        "currency",
        "message",
        "occurred_at",
        "metadata",
    )
    can_delete = False


@admin.register(Offer)
class OfferAdmin(admin.ModelAdmin):
    list_display = (
        "listing",
        "buyer_party",
        "amount",
        "currency",
        "status",
        "expires_at",
        "created_at",
    )

    search_fields = (
        "listing__title",
        "buyer_party__display_name",
        "message",
    )

    list_filter = (
        "status",
        "currency",
        "created_at",
        "expires_at",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
        "responded_at",
        "withdrawn_at",
    )

    inlines = [
        OfferEventInline,
    ]


@admin.register(OfferEvent)
class OfferEventAdmin(admin.ModelAdmin):
    list_display = (
        "offer",
        "event_type",
        "actor",
        "amount",
        "currency",
        "occurred_at",
    )

    search_fields = (
        "offer__listing__title",
        "actor__email",
        "message",
    )

    list_filter = (
        "event_type",
        "occurred_at",
    )
