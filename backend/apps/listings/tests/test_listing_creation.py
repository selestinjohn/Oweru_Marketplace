import pytest

from apps.identity.models import User
from apps.listings.models import (
    Listing,
    ListingParty,
    ListingPartyRelationship,
    ListingStatus,
)
from apps.parties.models import (
    IdentityStatus,
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


@pytest.mark.django_db
def test_property_owner_can_create_listing(
    api_client,
):

    user = User.objects.create_user(
        email="seller@example.com",
        password="StrongPassword123!",
    )

    Party.objects.create(
        user=user,
        party_type=PartyType.PERSON,
        display_name="Seller User",
    )

    seller_role = Role.objects.get(
        code="SELLER"
    )

    PartyRole.objects.create(
        party=user.party,
        role=seller_role,
    )

    property = Property.objects.create(
        reference_number="OWERU-LIST-001",
        property_type=PropertyType.LAND,
    )

    PropertyParty.objects.create(
        property=property,
        party=user.party,
        relationship=PropertyPartyRole.OWNER,
        source_type=SourceType.USER_SUPPLIED,
        started_at="2026-08-26T10:00:00Z",
    )

    api_client.force_authenticate(
        user=user,
    )

    response = api_client.post(
        "/api/v1/listings/",
        {
            "property": str(property.id),
            "title": "Prime Land",
            "description": "Beautiful residential land.",
            "price": "50000000.00",
            "currency": "TZS",
        },
        format="json",
    )

    assert response.status_code == 201

    listing = Listing.objects.get(
        property=property,
    )

    assert listing.status == "DRAFT"

    assert ListingParty.objects.filter(
        listing=listing,
        party=user.party,
        relationship=(
            ListingPartyRelationship.OWNER
        ),
        is_active=True,
    ).exists()



@pytest.mark.django_db
def test_buyer_cannot_create_listing(
    api_client,
):

    user = User.objects.create_user(
        email="buyer@example.com",
        password="StrongPassword123!",
    )

    Party.objects.create(
        user=user,
        party_type=PartyType.PERSON,
        display_name="Buyer User",
    )

    buyer_role = Role.objects.get(
        code="BUYER"
    )

    PartyRole.objects.create(
        party=user.party,
        role=buyer_role,
    )

    property = Property.objects.create(
        reference_number="OWERU-LIST-002",
        property_type=PropertyType.LAND,
    )

    api_client.force_authenticate(
        user=user,
    )

    response = api_client.post(
        "/api/v1/listings/",
        {
            "property": str(property.id),
            "title": "Unauthorized Listing",
            "description": "Should fail.",
            "price": "10000000.00",
            "currency": "TZS",
        },
        format="json",
    )

    assert response.status_code == 403

    assert not Listing.objects.filter(
        property=property,
    ).exists()



@pytest.mark.django_db
def test_seller_cannot_create_listing_for_unrelated_property(
    api_client,
):

    owner = User.objects.create_user(
        email="owner@example.com",
        password="StrongPassword123!",
    )

    seller = User.objects.create_user(
        email="seller2@example.com",
        password="StrongPassword123!",
    )

    Party.objects.create(
        user=owner,
        party_type=PartyType.PERSON,
        display_name="Owner User",
    )

    Party.objects.create(
        user=seller,
        party_type=PartyType.PERSON,
        display_name="Seller Two",
    )

    seller_role = Role.objects.get(
        code="SELLER"
    )

    PartyRole.objects.create(
        party=owner.party,
        role=seller_role,
    )

    PartyRole.objects.create(
        party=seller.party,
        role=seller_role,
    )

    property = Property.objects.create(
        reference_number="OWERU-LIST-003",
        property_type=PropertyType.LAND,
    )

    PropertyParty.objects.create(
        property=property,
        party=owner.party,
        relationship=PropertyPartyRole.OWNER,
        source_type=SourceType.USER_SUPPLIED,
        started_at="2026-08-26T10:00:00Z",
    )

    api_client.force_authenticate(
        user=seller,
    )

    response = api_client.post(
        "/api/v1/listings/",
        {
            "property": str(property.id),
            "title": "Unauthorized",
            "description": "Should fail.",
            "price": "10000000.00",
            "currency": "TZS",
        },
        format="json",
    )

    assert response.status_code == 403



@pytest.mark.django_db
def test_listing_rejects_non_positive_price(
    api_client,
    seller_user,
    owned_property,
):

    api_client.force_authenticate(
        user=seller_user,
    )

    response = api_client.post(
        "/api/v1/listings/",
        {
            "property": str(
                owned_property.id
            ),
            "title": "Invalid Price",
            "description": "Should fail.",
            "price": "0",
            "currency": "TZS",
        },
        format="json",
    )

    assert response.status_code == 400





@pytest.mark.django_db
def test_public_user_can_see_published_listing(
    api_client,
    published_listing,
):

    response = api_client.get(
        f"/api/v1/listings/{published_listing.id}/"
    )

    assert response.status_code == 200

    assert "property_summary" in response.data
    assert "seller_summary" in response.data
    assert "trust_summary" in response.data
    assert "primary_image_url" in response.data
    assert "media" in response.data

    assert (
        response.data["property_summary"]["reference_number"]
        == published_listing.property.reference_number
    )



@pytest.mark.django_db
def test_draft_listing_is_not_public(
    api_client,
    draft_listing,
):

    response = api_client.get(
        f"/api/v1/listings/{draft_listing.id}/"
    )

    assert response.status_code == 404



@pytest.mark.django_db
def test_public_listing_endpoint_returns_only_published(
    api_client,
    published_listing,
    draft_listing,
):

    response = api_client.get(
        "/api/v1/listings/"
    )

    assert response.status_code == 200

    ids = [
        item["id"]
        for item in response.data
    ]

    assert str(
        published_listing.id
    ) in ids

    assert str(
        draft_listing.id
    ) not in ids


@pytest.mark.django_db
def test_public_listing_endpoint_supports_filters_and_pagination(
    api_client,
    seller_user,
    published_listing,
):
    seller_user.party.identity_status = IdentityStatus.VERIFIED
    seller_user.party.save(
        update_fields=[
            "identity_status",
            "updated_at",
        ]
    )

    published_listing.title = "Kigamboni Verified Plot"
    published_listing.price = "22000000.00"
    published_listing.property.location_description = (
        "Kigamboni, Dar es Salaam"
    )
    published_listing.property.latitude = "-6.8469000"
    published_listing.property.longitude = "39.3167000"
    published_listing.property.save(
        update_fields=[
            "location_description",
            "latitude",
            "longitude",
            "updated_at",
        ]
    )
    published_listing.save(
        update_fields=[
            "title",
            "price",
            "updated_at",
        ]
    )

    other_property = Property.objects.create(
        reference_number="OWERU-LIST-PUB-002",
        property_type=PropertyType.APARTMENT,
        location_description="Arusha",
    )
    Listing.objects.create(
        property=other_property,
        title="Arusha Apartment",
        description="A published listing outside the search filter.",
        price="10000000.00",
        currency="TZS",
        status=ListingStatus.PUBLISHED,
    )

    response = api_client.get(
        "/api/v1/listings/",
        {
            "search": "kigamboni",
            "property_type": "LAND",
            "min_price": "20000000",
            "max_price": "25000000",
            "has_coordinates": "true",
            "page": "1",
            "page_size": "5",
        },
    )

    assert response.status_code == 200
    assert response.data["count"] == 1

    item = response.data["results"][0]

    assert item["id"] == str(
        published_listing.id
    )
    assert (
        item["property_summary"]["location_description"]
        == "Kigamboni, Dar es Salaam"
    )
    assert item["seller_summary"]["is_identity_verified"] is True


@pytest.mark.django_db
def test_public_listing_endpoint_rejects_invalid_filters(
    api_client,
    published_listing,
):
    response = api_client.get(
        "/api/v1/listings/",
        {
            "min_price": "not-a-number",
        },
    )

    assert response.status_code == 400
    assert response.data["error"]["code"] == "validation_error"
    assert "min_price" in response.data["error"]["details"]




@pytest.mark.django_db
def test_party_can_see_own_listings(
    api_client,
    seller_user,
    seller_listing,
):

    api_client.force_authenticate(
        user=seller_user,
    )

    response = api_client.get(
        "/api/v1/listings/mine/"
    )

    assert response.status_code == 200

    ids = [
        item["id"]
        for item in response.data
    ]

    assert str(
        seller_listing.id
    ) in ids


@pytest.mark.django_db
def test_party_cannot_see_unrelated_listing_in_mine(
    api_client,
    another_user,
    seller_listing,
):

    api_client.force_authenticate(
        user=another_user,
    )

    response = api_client.get(
        "/api/v1/listings/mine/"
    )

    assert response.status_code == 200

    ids = [
        item["id"]
        for item in response.data
    ]

    assert str(
        seller_listing.id
    ) not in ids




@pytest.mark.django_db
def test_owner_can_publish_listing(
    api_client,
    seller_user,
    draft_listing,
):

    api_client.force_authenticate(
        user=seller_user,
    )

    response = api_client.post(
        f"/api/v1/listings/"
        f"{draft_listing.id}/publish/"
    )

    assert response.status_code == 200

    draft_listing.refresh_from_db()

    assert (
        draft_listing.status
        == ListingStatus.PUBLISHED
    )

    assert (
        draft_listing.published_at
        is not None
    )

@pytest.mark.django_db
def test_published_listing_cannot_be_published_again(
    api_client,
    seller_user,
    published_listing,
):

    api_client.force_authenticate(
        user=seller_user,
    )

    response = api_client.post(
        f"/api/v1/listings/"
        f"{published_listing.id}/publish/"
    )

    assert response.status_code == 400




@pytest.mark.django_db
def test_owner_can_pause_published_listing(
    api_client,
    seller_user,
    published_listing,
):

    api_client.force_authenticate(
        user=seller_user,
    )

    response = api_client.post(
        f"/api/v1/listings/"
        f"{published_listing.id}/pause/"
    )

    assert response.status_code == 200

    published_listing.refresh_from_db()

    assert (
        published_listing.status
        == ListingStatus.PAUSED
    )


@pytest.mark.django_db
def test_owner_can_resume_paused_listing(
    api_client,
    seller_user,
    paused_listing,
):

    api_client.force_authenticate(
        user=seller_user,
    )

    response = api_client.post(
        f"/api/v1/listings/"
        f"{paused_listing.id}/resume/"
    )

    assert response.status_code == 200

    paused_listing.refresh_from_db()

    assert (
        paused_listing.status
        == ListingStatus.PUBLISHED
    )



@pytest.mark.django_db
def test_owner_can_close_listing(
    api_client,
    seller_user,
    published_listing,
):

    api_client.force_authenticate(
        user=seller_user,
    )

    response = api_client.post(
        f"/api/v1/listings/"
        f"{published_listing.id}/close/"
    )

    assert response.status_code == 200

    published_listing.refresh_from_db()

    assert (
        published_listing.status
        == ListingStatus.CLOSED
    )
