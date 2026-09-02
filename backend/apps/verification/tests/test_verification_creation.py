import pytest

from apps.verification.models import (
    VerificationStatus,
)


@pytest.mark.django_db
def test_authorized_user_can_request_verification(
    api_client,
    requester_user,
    owner_property,
):

    api_client.force_authenticate(
        user=requester_user
    )

    response = api_client.post(
        "/api/v1/verifications/",
        {
            "property": str(
                owner_property.id
            )
        },
        format="json",
    )

    assert response.status_code == 201

    assert response.data["property"] == (
        owner_property.id
    )

    assert response.data["status"] == (
        VerificationStatus.REQUESTED
    )
