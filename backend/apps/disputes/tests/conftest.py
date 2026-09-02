import pytest

from apps.listings.models import (
    Listing,
    ListingParty,
    ListingPartyRelationship,
    ListingStatus,
)
from apps.offers.models import Offer, OfferStatus


@pytest.fixture
def accepted_offer(db, requester_user, owner_user, owner_property):
    listing = Listing.objects.create(
        property=owner_property,
        title="Accepted Dispute Listing",
        description="A listing with an accepted offer for dispute tests.",
        price="10000000.00",
        currency="TZS",
        status=ListingStatus.PUBLISHED,
    )

    ListingParty.objects.create(
        listing=listing,
        party=owner_user.party,
        relationship=ListingPartyRelationship.OWNER,
        is_active=True,
    )

    return Offer.objects.create(
        listing=listing,
        buyer_party=requester_user.party,
        amount="9000000.00",
        currency="TZS",
        status=OfferStatus.ACCEPTED,
        created_by=requester_user,
        responded_by=owner_user,
    )
