from apps.authorization.services import AuthorizationService
from apps.parties.constants import PermissionCode
from apps.properties.models import PropertyPartyRole
from apps.listings.models import (
    ListingPartyRelationship,
    ListingStatus,
)

class PropertyPolicy:

    @staticmethod
    def can_create(*, party):

        if AuthorizationService.is_admin(party=party):
            return True

        return AuthorizationService.has_permission(
            party=party,
            permission_code=PermissionCode.PROPERTY_CREATE,
        )

    @staticmethod
    def can_view(*, party, property):

        return AuthorizationService.has_permission(
            party=party,
            permission_code=PermissionCode.PROPERTY_VIEW,
        )

    @staticmethod
    def can_edit(*, party, property):

        if AuthorizationService.is_admin(party=party):
            return True

        if not AuthorizationService.has_permission(
            party=party,
            permission_code=PermissionCode.PROPERTY_UPDATE,
        ):
            return False

        return property.parties.filter(
            party=party,
            relationship__in=[
                PropertyPartyRole.OWNER,
                PropertyPartyRole.SELLER,
                PropertyPartyRole.MANAGER,
            ],
            ended_at__isnull=True,
        ).exists()


class ListingPolicy:

    @staticmethod
    def can_create(*, party, property):

        if AuthorizationService.is_admin(party=party):
            return True

        if not AuthorizationService.has_permission(
            party=party,
            permission_code=PermissionCode.LISTING_CREATE,
        ):
            return False

        return property.parties.filter(
            party=party,
            relationship__in=[
                PropertyPartyRole.OWNER,
                PropertyPartyRole.SELLER,
                PropertyPartyRole.MANAGER,
            ],
            ended_at__isnull=True,
        ).exists()

    @staticmethod
    def can_manage(*, party, listing):

        if AuthorizationService.is_admin(party=party):
            return True

        if not AuthorizationService.has_permission(
            party=party,
            permission_code=PermissionCode.LISTING_UPDATE,
        ):
            return False

        return listing.parties.filter(
            party=party,
            relationship__in=[
                "OWNER",
                "AGENT",
            ],
            is_active=True,
        ).exists()


    @staticmethod
    def can_view_public(
        *,
        listing,
    ):

        return listing.status == ListingStatus.PUBLISHED


    @staticmethod
    def can_view_manageable(
        *,
        party,
        listing,
    ):

        return ListingPolicy.can_manage(
            party=party,
            listing=listing,
        )







class DocumentPolicy:
    @staticmethod
    def can_create(
        *,
        party,
        property,
    ):
        if AuthorizationService.is_admin(
            party=party,
        ):
            return True

        if not AuthorizationService.has_permission(
            party=party,
            permission_code=PermissionCode.DOCUMENT_UPLOAD,
        ):
            return False

        return property.parties.filter(
            party=party,
            relationship__in=[
                PropertyPartyRole.OWNER,
                PropertyPartyRole.SELLER,
                PropertyPartyRole.MANAGER,
            ],
            ended_at__isnull=True,
        ).exists()

    @staticmethod
    def can_view(
        *,
        party,
        document,
    ):
        if AuthorizationService.is_admin(
            party=party,
        ):
            return True

        if not AuthorizationService.has_permission(
            party=party,
            permission_code=PermissionCode.DOCUMENT_VIEW,
        ):
            return False

        return document.property.parties.filter(
            party=party,
            relationship__in=[
                PropertyPartyRole.OWNER,
                PropertyPartyRole.SELLER,
                PropertyPartyRole.MANAGER,
            ],
            ended_at__isnull=True,
        ).exists()

    @staticmethod
    def can_review(
        *,
        party,
        document,
    ):
        if AuthorizationService.is_admin(
            party=party,
        ):
            return True

        return AuthorizationService.has_permission(
            party=party,
            permission_code=PermissionCode.DOCUMENT_REVIEW,
        )


class EvidencePolicy:

    @staticmethod
    def can_create(
        *,
        party,
        property,
    ):

        if AuthorizationService.is_admin(
            party=party,
        ):
            return True

        return AuthorizationService.has_permission(
            party=party,
            permission_code=PermissionCode.EVIDENCE_CREATE,
        )
