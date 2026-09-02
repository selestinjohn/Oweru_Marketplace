from django.contrib import admin

from .models import Document


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = (
        "property",
        "document_type",
        "source_type",
        "status",
        "uploaded_by",
        "sighted_at",
        "issued_at",
        "expires_at",
        "created_at",
    )

    search_fields = (
        "property__id",
        "file_reference",
        "description",
        "uploaded_by__username",
    )

    list_filter = (
        "document_type",
        "source_type",
        "status",
        "created_at",
        "expires_at",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )