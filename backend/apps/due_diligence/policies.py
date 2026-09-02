from apps.authorization.services import AuthorizationService
from apps.parties.constants import PermissionCode
from apps.properties.models import PropertyParty


class DueDiligencePolicy:

    @staticmethod
    def can_request(
        *,
        party,
        property,
        transaction=None,
    ):
        if AuthorizationService.is_admin(
            party=party,
        ):
            return True

        if not AuthorizationService.has_permission(
            party=party,
            permission_code=PermissionCode.DUE_DILIGENCE_REQUEST,
        ):
            return False

        if transaction:
            return party.id in {
                transaction.buyer_party_id,
                transaction.seller_party_id,
            }

        return AuthorizationService.has_permission(
            party=party,
            permission_code=PermissionCode.PROPERTY_VIEW,
        )

    @staticmethod
    def can_view(
        *,
        party,
        request,
    ):
        if AuthorizationService.is_admin(
            party=party,
        ):
            return True

        if DueDiligencePolicy.can_review(
            party=party,
        ):
            return True

        if not party:
            return False

        if request.requested_by_party_id == getattr(
            party,
            "id",
            None,
        ):
            return True

        if request.transaction and party.id in {
            request.transaction.buyer_party_id,
            request.transaction.seller_party_id,
        }:
            return True

        return PropertyParty.objects.filter(
            property=request.property,
            party=party,
            ended_at__isnull=True,
        ).exists()

    @staticmethod
    def can_review(
        *,
        party,
    ):
        if AuthorizationService.is_admin(
            party=party,
        ):
            return True

        return AuthorizationService.has_permission(
            party=party,
            permission_code=PermissionCode.DUE_DILIGENCE_REVIEW,
        )

    @staticmethod
    def can_cancel(
        *,
        party,
        request,
    ):
        if DueDiligencePolicy.can_review(
            party=party,
        ):
            return True

        return request.requested_by_party_id == getattr(
            party,
            "id",
            None,
        )
