

import pytest

from apps.verification.models import VerificationStatus


@pytest.mark.django_db
def test_admin_can_assign_verifier(
    api_client,
    admin_user,
    verification,
    verifier_user,
):

    api_client.force_authenticate(
        user=admin_user
    )

    response = api_client.post(
        f"/api/v1/verifications/"
        f"{verification.id}/assign/",
        {
            "verifier": verifier_user.id
        },
        format="json",
    )

    assert response.status_code == 200

    verification.refresh_from_db()

    assert (
        verification.assigned_verifier_id
        == verifier_user.id
    )

    assert verification.status == (
        VerificationStatus.ASSIGNED
    )

    assert verification.assigned_at is not None