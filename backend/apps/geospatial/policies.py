from apps.authorization.services import AuthorizationService
from apps.parties.constants import PermissionCode
from apps.properties.models import PropertyParty


class GeospatialPolicy:

    @staticmethod
    def can_view(
        *,
        party,
        property,
    ):
        if AuthorizationService.is_admin(
            party=party,
        ):
            return True

        if not party:
            return False

        if AuthorizationService.has_permission(
            party=party,
            permission_code=PermissionCode.VERIFICATION_PERFORM,
        ):
            return True

        if not AuthorizationService.has_permission(
            party=party,
            permission_code=PermissionCode.PROPERTY_VIEW,
        ):
            return False

        return PropertyParty.objects.filter(
            property=property,
            party=party,
            ended_at__isnull=True,
        ).exists()

    @staticmethod
    def can_record(
        *,
        party,
        property,
    ):
        if AuthorizationService.is_admin(
            party=party,
        ):
            return True

        if not party:
            return False

        if AuthorizationService.has_permission(
            party=party,
            permission_code=PermissionCode.VERIFICATION_PERFORM,
        ):
            return True

        if not AuthorizationService.has_permission(
            party=party,
            permission_code=PermissionCode.PROPERTY_UPDATE,
        ):
            return False

        return PropertyParty.objects.filter(
            property=property,
            party=party,
            ended_at__isnull=True,
        ).exists()
