from apps.authorization.services import AuthorizationService
from apps.listings.models import ListingParty
from apps.parties.constants import PermissionCode
from apps.properties.models import PropertyParty


class DisputePolicy:

    @staticmethod
    def can_create(
        *,
        party,
        transaction=None,
        payment=None,
        listing=None,
        property=None,
    ):
        if AuthorizationService.is_admin(
            party=party,
        ):
            return True

        if not AuthorizationService.has_permission(
            party=party,
            permission_code=PermissionCode.DISPUTE_CREATE,
        ):
            return False

        return DisputePolicy._is_related(
            party=party,
            transaction=transaction,
            payment=payment,
            listing=listing,
            property=property,
        )

    @staticmethod
    def can_view(
        *,
        party,
        dispute,
    ):
        if AuthorizationService.is_admin(
            party=party,
        ):
            return True

        if DisputePolicy.can_review(
            party=party,
        ):
            return True

        if dispute.opened_by_party_id == getattr(
            party,
            "id",
            None,
        ):
            return True

        return DisputePolicy._is_related(
            party=party,
            transaction=dispute.transaction,
            payment=dispute.payment,
            listing=dispute.listing,
            property=dispute.property,
        )

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
            permission_code=PermissionCode.DISPUTE_REVIEW,
        )

    @staticmethod
    def can_comment(
        *,
        party,
        dispute,
        is_internal=False,
    ):
        if is_internal:
            return DisputePolicy.can_review(
                party=party,
            )

        return DisputePolicy.can_view(
            party=party,
            dispute=dispute,
        )

    @staticmethod
    def _is_related(
        *,
        party,
        transaction=None,
        payment=None,
        listing=None,
        property=None,
    ):
        if not party:
            return False

        if transaction and party.id in {
            transaction.buyer_party_id,
            transaction.seller_party_id,
        }:
            return True

        if payment and party.id in {
            payment.payer_party_id,
            payment.payee_party_id,
            payment.transaction.buyer_party_id,
            payment.transaction.seller_party_id,
        }:
            return True

        if listing and ListingParty.objects.filter(
            listing=listing,
            party=party,
            is_active=True,
        ).exists():
            return True

        if property and PropertyParty.objects.filter(
            property=property,
            party=party,
            is_active=True,
        ).exists():
            return True

        return False
