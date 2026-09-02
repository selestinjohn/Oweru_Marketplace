from django.db import migrations


PERMISSIONS = {
    "due_diligence.request": "Request due diligence",
    "due_diligence.review": "Review due diligence",
}


ROLE_PERMISSIONS = {
    "BUYER": [
        "due_diligence.request",
    ],
    "SELLER": [
        "due_diligence.request",
    ],
    "AGENT": [
        "due_diligence.request",
    ],
    "VERIFIER": [
        "due_diligence.review",
    ],
    "PROFESSIONAL": [
        "due_diligence.review",
    ],
    "PROPERTY_MANAGER": [
        "due_diligence.request",
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
        ("parties", "0004_seed_document_evidence_permissions"),
    ]

    operations = [
        migrations.RunPython(
            seed_permissions,
            unseed_permissions,
        ),
    ]
