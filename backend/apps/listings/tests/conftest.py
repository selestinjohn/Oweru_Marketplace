import pytest

from apps.identity.models import User
from apps.listings.models import (
    Listing,
    ListingParty,
    ListingPartyRelationship,
    ListingStatus,
)
from apps.parties.models import (
    Party,
    PartyRole,
    PartyType,
    Role,
)
from apps.properties.models import (
    Property,
    PropertyParty,
    PropertyPartyRole,
    PropertyType,
    SourceType,
)


def _make_owned_listing(*, party, status, reference_number, title):
    property = Property.objects.create(
        reference_number=reference_number,
        property_type=PropertyType.LAND,
    )

    PropertyParty.objects.create(
        property=property,
        party=party,
        relationship=PropertyPartyRole.OWNER,
        source_type=SourceType.USER_SUPPLIED,
        started_at="2026-08-26T10:00:00Z",
    )

    listing = Listing.objects.create(
        property=property,
        title=title,
        description="Test listing.",
        price="10000000.00",
        currency="TZS",
        status=status,
    )

    ListingParty.objects.create(
        listing=listing,
        party=party,
        relationship=ListingPartyRelationship.OWNER,
        is_active=True,
    )

    return listing


@pytest.fixture
def seller_user(db):
    user = User.objects.create_user(
        email="seller-listing-fixture@example.com",
        password="StrongPassword123!",
    )

    party = Party.objects.create(
        user=user,
        party_type=PartyType.PERSON,
        display_name="Seller Listing Fixture",
    )

    seller = Role.objects.get(
        code="SELLER",
    )

    PartyRole.objects.create(
        party=party,
        role=seller,
    )

    return user


@pytest.fixture
def owned_property(db, seller_user):
    property = Property.objects.create(
        reference_number="OWERU-LIST-FIX-001",
        property_type=PropertyType.LAND,
    )

    PropertyParty.objects.create(
        property=property,
        party=seller_user.party,
        relationship=PropertyPartyRole.OWNER,
        source_type=SourceType.USER_SUPPLIED,
        started_at="2026-08-26T10:00:00Z",
    )

    return property


@pytest.fixture
def another_user(db):
    user = User.objects.create_user(
        email="another-listing@example.com",
        password="StrongPassword123!",
    )

    Party.objects.create(
        user=user,
        party_type=PartyType.PERSON,
        display_name="Another User",
    )

    return user


@pytest.fixture
def draft_listing(db, seller_user):
    return _make_owned_listing(
        party=seller_user.party,
        status=ListingStatus.DRAFT,
        reference_number="OWERU-LIST-DRAFT-001",
        title="Draft Listing",
    )


@pytest.fixture
def published_listing(db, seller_user):
    return _make_owned_listing(
        party=seller_user.party,
        status=ListingStatus.PUBLISHED,
        reference_number="OWERU-LIST-PUB-001",
        title="Published Listing",
    )


@pytest.fixture
def paused_listing(db, seller_user):
    return _make_owned_listing(
        party=seller_user.party,
        status=ListingStatus.PAUSED,
        reference_number="OWERU-LIST-PAUSE-001",
        title="Paused Listing",
    )


@pytest.fixture
def seller_listing(db, seller_user):
    return _make_owned_listing(
        party=seller_user.party,
        status=ListingStatus.DRAFT,
        reference_number="OWERU-LIST-MINE-001",
        title="Seller Listing",
    )
