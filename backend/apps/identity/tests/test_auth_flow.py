from datetime import timedelta

import pytest
from django.utils import timezone
from rest_framework_simplejwt.tokens import RefreshToken

from apps.authorization.services import AuthorizationService
from apps.identity.models import AccountStatus, User
from apps.parties.constants import PermissionCode
from apps.parties.models import (
    Party,
    PartyRole,
    PartyType,
    Role,
)


def create_party_user(
    *,
    email,
    role_code,
):
    user = User.objects.create_user(
        email=email,
        password="StrongPassword123!",
    )
    party = Party.objects.create(
        user=user,
        party_type=PartyType.PERSON,
        display_name=email,
    )
    PartyRole.objects.create(
        party=party,
        role=Role.objects.get(
            code=role_code,
        ),
    )

    return user


@pytest.mark.django_db
def test_login_returns_frontend_auth_context(api_client):
    user = create_party_user(
        email="seller-auth@example.com",
        role_code="SELLER",
    )

    response = api_client.post(
        "/api/v1/auth/login/",
        {
            "email": user.email,
            "password": "StrongPassword123!",
        },
        format="json",
    )

    assert response.status_code == 200
    assert response.data["user"]["email"] == user.email
    assert response.data["party"]["id"] == str(user.party.id)
    assert "SELLER" in response.data["roles"]
    assert (
        PermissionCode.LISTING_CREATE
        in response.data["permissions"]
    )
    assert response.data["tokens"]["access"]
    assert response.data["tokens"]["refresh"]


@pytest.mark.django_db
def test_me_returns_roles_and_permissions(api_client):
    user = create_party_user(
        email="buyer-context@example.com",
        role_code="BUYER",
    )

    api_client.force_authenticate(
        user=user,
    )

    response = api_client.get(
        "/api/v1/auth/me/",
    )

    assert response.status_code == 200
    assert response.data["roles"] == [
        "BUYER",
    ]
    assert (
        PermissionCode.OFFER_CREATE
        in response.data["permissions"]
    )


@pytest.mark.django_db
def test_logout_route_blacklists_refresh_token(api_client):
    user = create_party_user(
        email="logout@example.com",
        role_code="BUYER",
    )
    refresh = RefreshToken.for_user(user)

    api_client.force_authenticate(
        user=user,
    )

    response = api_client.post(
        "/api/v1/auth/logout/",
        {
            "refresh": str(refresh),
        },
        format="json",
    )

    assert response.status_code == 205
    assert response.data["detail"] == "Successfully logged out."


@pytest.mark.django_db
def test_manual_login_errors_use_api_contract(api_client):
    response = api_client.post(
        "/api/v1/auth/login/",
        {
            "email": "missing-password@example.com",
        },
        format="json",
    )

    assert response.status_code == 400
    assert response.data["detail"] == (
        "Email and password are required."
    )
    assert response.data["error"]["code"] == "missing_credentials"


@pytest.mark.django_db
def test_inactive_account_cannot_login(api_client):
    user = create_party_user(
        email="inactive@example.com",
        role_code="BUYER",
    )
    user.status = AccountStatus.SUSPENDED
    user.save(
        update_fields=[
            "status",
        ]
    )

    response = api_client.post(
        "/api/v1/auth/login/",
        {
            "email": user.email,
            "password": "StrongPassword123!",
        },
        format="json",
    )

    assert response.status_code == 403
    assert response.data["error"]["code"] == "account_inactive"


@pytest.mark.django_db
def test_expired_role_assignment_does_not_grant_permission():
    user = User.objects.create_user(
        email="expired-role@example.com",
        password="StrongPassword123!",
    )
    party = Party.objects.create(
        user=user,
        party_type=PartyType.PERSON,
        display_name="Expired Role",
    )
    PartyRole.objects.create(
        party=party,
        role=Role.objects.get(
            code="BUYER",
        ),
        expires_at=timezone.now() - timedelta(days=1),
    )

    assert not AuthorizationService.has_permission(
        party=party,
        permission_code=PermissionCode.OFFER_CREATE,
    )
    assert AuthorizationService.role_codes(
        party=party,
    ) == []
