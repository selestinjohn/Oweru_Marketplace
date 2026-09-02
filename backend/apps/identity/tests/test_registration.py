import pytest

from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from apps.identity.models import User
from apps.parties.models import Party, PartyType, PartyRole



@pytest.mark.django_db
def test_registration_creates_user_party_and_role(
    api_client,
):

    response = api_client.post(
        "/api/v1/auth/register/",
        {
            "email": "john@example.com",
            "phone_number": "+255700000001",
            "password": "StrongPassword123!",
            "display_name": "John Doe",
        },
        format="json",
    )

    assert response.status_code == 201

    assert User.objects.filter(
        email="john@example.com"
    ).exists()

    party = Party.objects.get(
        display_name="John Doe"
    )

    assert party.user.email == (
        "john@example.com"
    )

    assert PartyRole.objects.filter(
        party=party,
        role__code="BUYER",
    ).exists()



@pytest.mark.django_db
def test_duplicate_email_is_rejected(
    api_client,
):

    payload = {
        "email": "john@example.com",
        "password": "StrongPassword123!",
        "display_name": "John Doe",
    }

    first = api_client.post(
        "/api/v1/auth/register/",
        payload,
        format="json",
    )

    assert first.status_code == 201

    second = api_client.post(
        "/api/v1/auth/register/",
        payload,
        format="json",
    )

    assert second.status_code == 400



@pytest.mark.django_db
def test_registration_requires_email_or_phone(
    api_client,
):

    response = api_client.post(
        "/api/v1/auth/register/",
        {
            "password": "StrongPassword123!",
            "display_name": "John Doe",
        },
        format="json",
    )

    assert response.status_code == 400



@pytest.mark.django_db
def test_me_requires_authentication(
    api_client,
):

    response = api_client.get(
        "/api/v1/auth/me/"
    )

    assert response.status_code == 401





@pytest.mark.django_db
def test_authenticated_user_can_access_me(
    api_client,
):

    user = User.objects.create_user(
        email="john@example.com",
        password="StrongPassword123!",
    )

    Party.objects.create(
        user=user,
        party_type=PartyType.PERSON,
        display_name="John Doe",
    )

    refresh = RefreshToken.for_user(user)

    api_client.credentials(
        HTTP_AUTHORIZATION=(
            f"Bearer {refresh.access_token}"
        )
    )

    response = api_client.get(
        "/api/v1/auth/me/"
    )

    assert response.status_code == 200

    assert response.data["user"]["email"] == (
        "john@example.com"
    )