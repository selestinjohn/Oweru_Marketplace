from django.db import migrations


PERMISSIONS = {
    "document.review": "Review documents",
    "evidence.create": "Record property evidence",
}


ROLE_PERMISSIONS = {
    "AGENT": [
        "evidence.create",
    ],
    "VERIFIER": [
        "evidence.create",
    ],
    "PROPERTY_MANAGER": [
        "evidence.create",
    ],
    "ADMIN": [
        "document.review",
        "evidence.create",
    ],
}


def seed_permissions(apps, schema_editor):
    Permission = apps.get_model("parties", "Permission")
    Role = apps.get_model("parties", "Role")
    RolePermission = apps.get_model("parties", "RolePermission")

    permission_objects = {}

    for code, name in PERMISSIONS.items():
        permission, _ = Permission.objects.update_or_create(
            code=code,
            defaults={
                "name": name,
            },
        )
        permission_objects[code] = permission

    for role_code, permission_codes in ROLE_PERMISSIONS.items():
        role, _ = Role.objects.get_or_create(
            code=role_code,
            defaults={
                "name": role_code.replace("_", " ").title(),
                "is_active": True,
            },
        )

        for permission_code in permission_codes:
            RolePermission.objects.get_or_create(
                role=role,
                permission=permission_objects[permission_code],
            )


def unseed_permissions(apps, schema_editor):
    Permission = apps.get_model("parties", "Permission")

    Permission.objects.filter(
        code__in=list(PERMISSIONS.keys()),
    ).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("parties", "0003_seed_permissions"),
    ]

    operations = [
        migrations.RunPython(
            seed_permissions,
            unseed_permissions,
        ),
    ]
