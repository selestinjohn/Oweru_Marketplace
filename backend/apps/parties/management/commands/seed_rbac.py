from django.core.management.base import BaseCommand

from apps.parties.constants import PermissionCode
from apps.parties.models import (
    Permission,
    Role,
    RolePermission,
)


class Command(BaseCommand):

    help = "Create OWERU default roles and permissions."

    def handle(self, *args, **options):

        permissions = {
            PermissionCode.PROPERTY_VIEW: (
                "View properties"
            ),
            PermissionCode.PROPERTY_CREATE: (
                "Create properties"
            ),
            PermissionCode.PROPERTY_UPDATE: (
                "Update properties"
            ),

            PermissionCode.LISTING_VIEW: (
                "View listings"
            ),
            PermissionCode.LISTING_CREATE: (
                "Create listings"
            ),
            PermissionCode.LISTING_UPDATE: (
                "Update listings"
            ),
            PermissionCode.LISTING_PUBLISH: (
                "Publish listings"
            ),

            PermissionCode.DOCUMENT_VIEW: (
                "View documents"
            ),
            PermissionCode.DOCUMENT_UPLOAD: (
                "Upload documents"
            ),
            PermissionCode.DOCUMENT_REVIEW: (
                "Review documents"
            ),
            PermissionCode.EVIDENCE_CREATE: (
                "Record property evidence"
            ),

            PermissionCode.VERIFICATION_REQUEST: (
                "Request verification"
            ),
            PermissionCode.VERIFICATION_ASSIGN: (
                "Assign verification"
            ),
            PermissionCode.VERIFICATION_PERFORM: (
                "Perform verification"
            ),
            PermissionCode.VERIFICATION_REVIEW: (
                "Review verification"
            ),

            PermissionCode.OFFER_CREATE: (
                "Create offers"
            ),
            PermissionCode.OFFER_RESPOND: (
                "Respond to offers"
            ),

            PermissionCode.TRANSACTION_VIEW: (
                "View transactions"
            ),
            PermissionCode.TRANSACTION_MANAGE: (
                "Manage transactions"
            ),

            PermissionCode.DISPUTE_CREATE: (
                "Create disputes"
            ),
            PermissionCode.DISPUTE_REVIEW: (
                "Review disputes"
            ),

            PermissionCode.DUE_DILIGENCE_REQUEST: (
                "Request due diligence"
            ),
            PermissionCode.DUE_DILIGENCE_REVIEW: (
                "Review due diligence"
            ),

            PermissionCode.ADMIN_MANAGE: (
                "Manage platform administration"
            ),
        }

        permission_objects = {}

        for code, name in permissions.items():

            permission, _ = Permission.objects.update_or_create(
                code=code,
                defaults={
                    "name": name,
                },
            )

            permission_objects[code] = permission

        role_permissions = {

            "BUYER": [
                PermissionCode.PROPERTY_VIEW,
                PermissionCode.LISTING_VIEW,
                PermissionCode.DOCUMENT_VIEW,
                PermissionCode.VERIFICATION_REQUEST,
                PermissionCode.OFFER_CREATE,
                PermissionCode.TRANSACTION_VIEW,
                PermissionCode.DISPUTE_CREATE,
                PermissionCode.DUE_DILIGENCE_REQUEST,
            ],

            "SELLER": [
                PermissionCode.PROPERTY_VIEW,
                PermissionCode.PROPERTY_CREATE,
                PermissionCode.PROPERTY_UPDATE,
                PermissionCode.LISTING_VIEW,
                PermissionCode.LISTING_CREATE,
                PermissionCode.LISTING_UPDATE,
                PermissionCode.DOCUMENT_VIEW,
                PermissionCode.DOCUMENT_UPLOAD,
                PermissionCode.VERIFICATION_REQUEST,
                PermissionCode.OFFER_RESPOND,
                PermissionCode.TRANSACTION_VIEW,
                PermissionCode.DISPUTE_CREATE,
                PermissionCode.DUE_DILIGENCE_REQUEST,
            ],

            "AGENT": [
                PermissionCode.PROPERTY_VIEW,
                PermissionCode.LISTING_VIEW,
                PermissionCode.LISTING_CREATE,
                PermissionCode.LISTING_UPDATE,
                PermissionCode.DOCUMENT_VIEW,
                PermissionCode.DOCUMENT_UPLOAD,
                PermissionCode.EVIDENCE_CREATE,
                PermissionCode.VERIFICATION_REQUEST,
                PermissionCode.OFFER_CREATE,
                PermissionCode.OFFER_RESPOND,
                PermissionCode.TRANSACTION_VIEW,
                PermissionCode.DISPUTE_CREATE,
                PermissionCode.DUE_DILIGENCE_REQUEST,
            ],

            "VERIFIER": [
                PermissionCode.PROPERTY_VIEW,
                PermissionCode.DOCUMENT_VIEW,
                PermissionCode.EVIDENCE_CREATE,
                PermissionCode.VERIFICATION_PERFORM,
                PermissionCode.DUE_DILIGENCE_REVIEW,
            ],

            "PROFESSIONAL": [
                PermissionCode.PROPERTY_VIEW,
                PermissionCode.LISTING_VIEW,
                PermissionCode.DOCUMENT_VIEW,
                PermissionCode.DISPUTE_CREATE,
                PermissionCode.DUE_DILIGENCE_REVIEW,
            ],

            "TENANT": [
                PermissionCode.PROPERTY_VIEW,
                PermissionCode.LISTING_VIEW,
                PermissionCode.DOCUMENT_VIEW,
                PermissionCode.DISPUTE_CREATE,
            ],

            "PROPERTY_MANAGER": [
                PermissionCode.PROPERTY_VIEW,
                PermissionCode.PROPERTY_UPDATE,
                PermissionCode.LISTING_VIEW,
                PermissionCode.LISTING_CREATE,
                PermissionCode.LISTING_UPDATE,
                PermissionCode.DOCUMENT_VIEW,
                PermissionCode.DOCUMENT_UPLOAD,
                PermissionCode.EVIDENCE_CREATE,
                PermissionCode.TRANSACTION_VIEW,
                PermissionCode.DISPUTE_CREATE,
                PermissionCode.DUE_DILIGENCE_REQUEST,
            ],

            "ADMIN": list(permissions.keys()),
        }

        for role_code, permission_codes in role_permissions.items():

            role, _ = Role.objects.update_or_create(
                code=role_code,
                defaults={
                    "name": role_code.replace(
                        "_",
                        " ",
                    ).title()
                },
            )

            for permission_code in permission_codes:

                RolePermission.objects.get_or_create(
                    role=role,
                    permission=permission_objects[
                        permission_code
                    ],
                )

        self.stdout.write(
            self.style.SUCCESS(
                "OWERU RBAC successfully seeded."
            )
        )
