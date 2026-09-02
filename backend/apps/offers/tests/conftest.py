import pytest

from apps.listings.models import (
    Listing,
    ListingParty,
    ListingPartyRelationship,
    ListingStatus,
)
from apps.properties.models import PropertyStatus


@pytest.fixture
def published_listing(db, owner_user, owner_property):
    owner_property.status = PropertyStatus.AVAILABLE
    owner_property.save(
        update_fields=[
            "status",
            "updated_at",
        ]
    )

    listing = Listing.objects.create(
        property=owner_property,
        title="Published Offer Listing",
        description="A listing ready for offers.",
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

    return listing
