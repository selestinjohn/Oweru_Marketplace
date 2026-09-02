from django.contrib import admin

from .models import Transaction, TransferChecklistItem


class TransferChecklistItemInline(admin.TabularInline):
    model = TransferChecklistItem
    extra = 0


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "property",
        "buyer_party",
        "seller_party",
        "agreed_amount",
        "currency",
        "status",
        "initiated_at",
    )

    search_fields = (
        "id",
        "property__reference_number",
        "buyer_party__display_name",
        "seller_party__display_name",
    )

    list_filter = (
        "status",
        "currency",
        "initiated_at",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
        "initiated_at",
    )

    inlines = [
        TransferChecklistItemInline,
    ]


@admin.register(TransferChecklistItem)
class TransferChecklistItemAdmin(admin.ModelAdmin):
    list_display = (
        "transaction",
        "position",
        "title",
        "responsible_party",
        "status",
        "completed_at",
    )

    search_fields = (
        "transaction__id",
        "title",
        "description",
    )

    list_filter = (
        "status",
        "completed_at",
    )
