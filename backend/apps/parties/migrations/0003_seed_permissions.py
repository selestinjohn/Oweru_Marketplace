# Seed the OWERU permission catalog and role -> permission mappings.
#
# Mirrors apps/parties/management/commands/seed_rbac.py so the RBAC data
# exists in every database (including the test database, which only runs
# migrations, not management commands). Codes/names are inlined as literals
# on purpose: migrations must not depend on app code that can change later.

from django.db import migrations


PERMISSIONS = {
    "property.view": "View properties",
    "property.create": "Create properties",
    "property.update": "Update properties",
    "listing.view": "View listings",
    "listing.create": "Create listings",
    "listing.update": "Update listings",
    "listing.publish": "Publish listings",
    "document.view": "View documents",
    "document.upload": "Upload documents",
    "verification.request": "Request verification",
    "verification.assign": "Assign verification",
    "verification.perform": "Perform verification",
    "verification.review": "Review verification",
    "offer.create": "Create offers",
    "offer.respond": "Respond to offers",
    "transaction.view": "View transactions",
    "transaction.manage": "Manage transactions",
    "dispute.create": "Create disputes",
    "dispute.review": "Review disputes",
    "admin.manage": "Manage platform administration",
}


ROLE_PERMISSIONS = {
    "BUYER": [
        "property.view",
        "listing.view",
        "document.view",
        "verification.request",
        "offer.create",
        "transaction.view",
        "dispute.create",
    ],
    "SELLER": [
        "property.view",
        "property.create",
        "property.update",
        "listing.view",
        "listing.create",
        "listing.update",
        "document.view",
        "document.upload",
        "verification.request",
        "offer.respond",
        "transaction.view",
        "dispute.create",
    ],
    "AGENT": [
        "property.view",
        "listing.view",
        "listing.create",
        "listing.update",
        "document.view",
        "document.upload",
        "verification.request",
        "offer.create",
        "offer.respond",
        "transaction.view",
        "dispute.create",
    ],
    "VERIFIER": [
        "property.view",
        "document.view",
        "verification.perform",
    ],
    "PROFESSIONAL": [
        "property.view",
        "listing.view",
        "document.view",
        "dispute.create",
    ],
    "TENANT": [
        "property.view",
        "listing.view",
        "document.view",
        "dispute.create",
    ],
    "PROPERTY_MANAGER": [
        "property.view",
        "property.update",
        "listing.view",
        "listing.create",
        "listing.update",
        "document.view",
        "document.upload",
        "transaction.view",
        "dispute.create",
    ],
    "ADMIN": list(PERMISSIONS.keys()),
}


def seed_permissions(apps, schema_editor):

    Permission = apps.get_model("parties", "Permission")
    Role = apps.get_model("parties", "Role")
    RolePermission = apps.get_model("parties", "RolePermission")

    permission_objects = {}

    for code, name in PERMISSIONS.items():
        permission, _ = Permission.objects.update_or_create(
            code=code,
            defaults={"name": name},
        )
        permission_objects[code] = permission

    for role_code, permission_codes in ROLE_PERMISSIONS.items():

        role, _ = Role.objects.update_or_create(
            code=role_code,
            defaults={
                "name": role_code.replace("_", " ").title(),
            },
        )

        for permission_code in permission_codes:
            RolePermission.objects.get_or_create(
                role=role,
                permission=permission_objects[permission_code],
            )


def unseed_permissions(apps, schema_editor):

    Permission = apps.get_model("parties", "Permission")

    # RolePermission has a CASCADE FK to Permission, so deleting the
    # permissions removes the mappings as well.
    Permission.objects.filter(
        code__in=list(PERMISSIONS.keys()),
    ).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("parties", "0002_seed_default_roles"),
    ]

    operations = [
        migrations.RunPython(
            seed_permissions,
            unseed_permissions,
        ),
    ]
