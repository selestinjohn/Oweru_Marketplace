from django.contrib import admin

from .models import Payment, Receipt


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = (
        "transaction",
        "purpose",
        "amount",
        "currency",
        "method",
        "status",
        "payer_party",
        "confirmed_at",
    )

    search_fields = (
        "external_reference",
        "transaction__id",
        "payer_party__display_name",
        "payee_party__display_name",
    )

    list_filter = (
        "purpose",
        "method",
        "status",
        "currency",
        "created_at",
    )


@admin.register(Receipt)
class ReceiptAdmin(admin.ModelAdmin):
    list_display = (
        "receipt_number",
        "payment",
        "issued_to",
        "issued_by",
        "issued_at",
    )

    search_fields = (
        "receipt_number",
        "payment__external_reference",
        "issued_to__display_name",
    )

    list_filter = (
        "issued_at",
    )
