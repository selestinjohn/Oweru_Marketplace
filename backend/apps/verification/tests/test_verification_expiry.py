from datetime import timedelta

from django.utils import timezone
import pytest

from apps.verification.models import VerificationStatus

@pytest.mark.django_db
def test_approved_verification_can_have_expiry(
    api_client,
    reviewer_user,
    submitted_verification,
):

    api_client.force_authenticate(
        user=reviewer_user
    )

    expires_at = (
        timezone.now()
        + timedelta(days=365)
    )

    response = api_client.post(
        f"/api/v1/verifications/"
        f"{submitted_verification.id}/decision/",
        {
            "outcome": "APPROVED",
            "summary": (
                "Verification approved."
            ),
            "expires_at": (
                expires_at.isoformat()
            ),
        },
        format="json",
    )

    assert response.status_code == 200

    submitted_verification.refresh_from_db()

    assert (
        submitted_verification
        .decision
        .expires_at
        is not None
    )


@pytest.mark.django_db
def test_expired_verification_is_not_active(
    approved_verification,
):

    approved_verification.status = (
        VerificationStatus.EXPIRED
    )

    approved_verification.save(
        update_fields=[
            "status",
            "updated_at",
        ]
    )

    approved_verification.refresh_from_db()

    assert approved_verification.status == (
        VerificationStatus.EXPIRED
    )

    assert approved_verification.status != (
        VerificationStatus.APPROVED
    )
