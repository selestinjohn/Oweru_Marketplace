from django.contrib import admin

from .models import (
    Party,
    Role,
    PartyRole,
    Permission,
    RolePermission,
)


@admin.register(Party)
class PartyAdmin(admin.ModelAdmin):
    list_display = (
        "display_name",
        "party_type",
        "identity_status",
        "tax_status",
        "created_at",
    )

    search_fields = (
        "display_name",
    )

    list_filter = (
        "party_type",
        "identity_status",
    )


@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = (
        "code",
        "name",
        "is_active",
    )


@admin.register(PartyRole)
class PartyRoleAdmin(admin.ModelAdmin):
    list_display = (
        "party",
        "role",
        "is_active",
        "assigned_at",
    )

    list_filter = (
        "role",
        "is_active",
    )


@admin.register(Permission)
class PermissionAdmin(admin.ModelAdmin):
    list_display = (
        "code",
        "name",
    )


@admin.register(RolePermission)
class RolePermissionAdmin(admin.ModelAdmin):
    list_display = (
        "role",
        "permission",
    )