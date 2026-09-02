from apps.authorization.services import AuthorizationService
from apps.listings.models import ListingPartyRelationship, ListingStatus
from apps.parties.constants import PermissionCode


class OfferPolicy:

    @staticmethod
    def can_create(
        *,
        party,
        listing,
    ):
        if not AuthorizationService.has_permission(
            party=party,
            permission_code=PermissionCode.OFFER_CREATE,
        ):
            return False

        if listing.status != ListingStatus.PUBLISHED:
            return False

        return not listing.parties.filter(
            party=party,
            relationship__in=[
                ListingPartyRelationship.OWNER,
                ListingPartyRelationship.AGENT,
            ],
            is_active=True,
        ).exists()

    @staticmethod
    def can_respond(
        *,
        party,
        offer,
    ):
        if AuthorizationService.is_admin(
            party=party,
        ):
            return True

        if not AuthorizationService.has_permission(
            party=party,
            permission_code=PermissionCode.OFFER_RESPOND,
        ):
            return False

        return offer.listing.parties.filter(
            party=party,
            relationship__in=[
                ListingPartyRelationship.OWNER,
                ListingPartyRelationship.AGENT,
            ],
            is_active=True,
        ).exists()

    @staticmethod
    def can_withdraw(
        *,
        party,
        offer,
    ):
        return offer.buyer_party_id == party.id
