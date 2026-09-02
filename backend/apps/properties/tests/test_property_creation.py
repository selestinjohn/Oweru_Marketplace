import pytest

from apps.identity.models import User

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
)


@pytest.mark.django_db
def test_seller_can_create_property(
    api_client,
):

    user = User.objects.create_user(
        email="seller@example.com",
        password="StrongPassword123!",
    )

    party = Party.objects.create(
        user=user,
        party_type=PartyType.PERSON,
        display_name="Seller User",
    )

    seller = Role.objects.get(
        code="SELLER",
    )

    PartyRole.objects.create(
        party=party,
        role=seller,
    )

    api_client.force_authenticate(
        user=user,
    )

    response = api_client.post(
        "/api/v1/properties/",
        {
            "reference_number": "OWERU-TEST-001",
            "property_type": "LAND",
            "description": "Test property",
        },
        format="json",
    )

    assert response.status_code == 201

    property = Property.objects.get(
        reference_number="OWERU-TEST-001"
    )

    assert PropertyParty.objects.filter(
        property=property,
        party=party,
        relationship=PropertyPartyRole.OWNER,
    ).exists()


@pytest.mark.django_db
def test_buyer_cannot_create_property(
    api_client,
):

    user = User.objects.create_user(
        email="buyer@example.com",
        password="StrongPassword123!",
    )

    party = Party.objects.create(
        user=user,
        party_type=PartyType.PERSON,
        display_name="Buyer User",
    )

    buyer = Role.objects.get(
        code="BUYER",
    )

    PartyRole.objects.create(
        party=party,
        role=buyer,
    )

    api_client.force_authenticate(
        user=user,
    )

    response = api_client.post(
        "/api/v1/properties/",
        {
            "reference_number": "OWERU-TEST-002",
            "property_type": "LAND",
        },
        format="json",
    )

    assert response.status_code == 403

    assert not Property.objects.filter(
        reference_number="OWERU-TEST-002"
    ).exists()


@pytest.mark.django_db
def test_anonymous_user_cannot_create_property(
    api_client,
):

    response = api_client.post(
        "/api/v1/properties/",
        {
            "reference_number": "OWERU-TEST-003",
            "property_type": "LAND",
        },
        format="json",
    )

    assert response.status_code == 401


@pytest.mark.django_db
def test_invalid_latitude_is_rejected(
    api_client,
    seller_user,
):

    api_client.force_authenticate(
        user=seller_user,
    )

    response = api_client.post(
        "/api/v1/properties/",
        {
            "reference_number": "OWERU-TEST-004",
            "property_type": "LAND",
            "latitude": 120,
        },
        format="json",
    )

    assert response.status_code == 400

from apps.identity.models import User

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
)


@pytest.mark.django_db
def test_seller_can_create_property(
    api_client,
):

    user = User.objects.create_user(
        email="seller@example.com",
        password="StrongPassword123!",
    )

    party = Party.objects.create(
        user=user,
        party_type=PartyType.PERSON,
        display_name="Seller User",
    )

    seller = Role.objects.get(
        code="SELLER",
    )

    PartyRole.objects.create(
        party=party,
        role=seller,
    )

    api_client.force_authenticate(
        user=user,
    )

    response = api_client.post(
        "/api/v1/properties/",
        {
            "reference_number": "OWERU-TEST-001",
            "property_type": "LAND",
            "description": "Test property",
        },
        format="json",
    )

    assert response.status_code == 201

    property = Property.objects.get(
        reference_number="OWERU-TEST-001"
    )

    assert PropertyParty.objects.filter(
        property=property,
        party=party,
        relationship=PropertyPartyRole.OWNER,
    ).exists()


@pytest.mark.django_db
def test_buyer_cannot_create_property(
    api_client,
):

    user = User.objects.create_user(
        email="buyer@example.com",
        password="StrongPassword123!",
    )

    party = Party.objects.create(
        user=user,
        party_type=PartyType.PERSON,
        display_name="Buyer User",
    )

    buyer = Role.objects.get(
        code="BUYER",
    )

    PartyRole.objects.create(
        party=party,
        role=buyer,
    )

    api_client.force_authenticate(
        user=user,
    )

    response = api_client.post(
        "/api/v1/properties/",
        {
            "reference_number": "OWERU-TEST-002",
            "property_type": "LAND",
        },
        format="json",
    )

    assert response.status_code == 403

    assert not Property.objects.filter(
        reference_number="OWERU-TEST-002"
    ).exists()


@pytest.mark.django_db
def test_anonymous_user_cannot_create_property(
    api_client,
):

    response = api_client.post(
        "/api/v1/properties/",
        {
            "reference_number": "OWERU-TEST-003",
            "property_type": "LAND",
        },
        format="json",
    )

    assert response.status_code == 401


@pytest.mark.django_db
def test_invalid_latitude_is_rejected(
    api_client,
    seller_user,
):

    api_client.force_authenticate(
        user=seller_user,
    )

    response = api_client.post(
        "/api/v1/properties/",
        {
            "reference_number": "OWERU-TEST-004",
            "property_type": "LAND",
            "latitude": 120,
        },
        format="json",
    )

    assert response.status_code == 400