

import pytest

from apps.verification.models import VerificationStatus


@pytest.mark.django_db
def test_assigned_verifier_can_start(
    api_client,
    verifier_user,
    assigned_verification,
):

    api_client.force_authenticate(
        user=verifier_user
    )

    response = api_client.post(
        f"/api/v1/verifications/"
        f"{assigned_verification.id}/start/",
        {},
        format="json",
    )

    assert response.status_code == 200

    assigned_verification.refresh_from_db()

    assert assigned_verification.status == (
        VerificationStatus.IN_PROGRESS
    )

    assert (
        assigned_verification.started_at
        is not None
    )


@pytest.mark.django_db
def test_wrong_verifier_cannot_start_verification(
    api_client,
    another_verifier_user,
    assigned_verification,
):

    api_client.force_authenticate(
        user=another_verifier_user
    )

    response = api_client.post(
        f"/api/v1/verifications/"
        f"{assigned_verification.id}/start/",
        {},
        format="json",
    )

    assert response.status_code == 403

    assigned_verification.refresh_from_db()

    assert assigned_verification.status == (
        VerificationStatus.ASSIGNED
    )



@pytest.mark.django_db
def test_assigned_verifier_can_submit(
    api_client,
    verifier_user,
    in_progress_verification,
):

    api_client.force_authenticate(
        user=verifier_user
    )

    response = api_client.post(
        f"/api/v1/verifications/"
        f"{in_progress_verification.id}/submit/",
        {},
        format="json",
    )

    assert response.status_code == 200

    in_progress_verification.refresh_from_db()

    assert in_progress_verification.status == (
        VerificationStatus.SUBMITTED
    )

    assert (
        in_progress_verification.submitted_at
        is not None
    )



@pytest.mark.django_db
def test_authorized_reviewer_can_approve(
    api_client,
    reviewer_user,
    submitted_verification,
):

    api_client.force_authenticate(
        user=reviewer_user
    )

    response = api_client.post(
        f"/api/v1/verifications/"
        f"{submitted_verification.id}/decision/",
        {
            "outcome": "APPROVED",
            "summary": (
                "All required checks passed."
            ),
        },
        format="json",
    )

    assert response.status_code == 200

    submitted_verification.refresh_from_db()

    assert submitted_verification.status == (
        VerificationStatus.APPROVED
    )

    assert hasattr(
        submitted_verification,
        "decision",
    )

    assert (
        submitted_verification.decision
        .decided_by
        == reviewer_user
    )



@pytest.mark.django_db
def test_authorized_reviewer_can_reject(
    api_client,
    reviewer_user,
    submitted_verification,
):

    api_client.force_authenticate(
        user=reviewer_user
    )

    response = api_client.post(
        f"/api/v1/verifications/"
        f"{submitted_verification.id}/decision/",
        {
            "outcome": "REJECTED",
            "summary": (
                "Required evidence was insufficient."
            ),
        },
        format="json",
    )

    assert response.status_code == 200

    submitted_verification.refresh_from_db()

    assert submitted_verification.status == (
        VerificationStatus.REJECTED
    )

    assert (
        submitted_verification.decision
        .outcome
        == "REJECTED"
    )


@pytest.mark.django_db
def test_invalid_transition_is_rejected(
    api_client,
    reviewer_user,
    verification,
):

    api_client.force_authenticate(
        user=reviewer_user
    )

    response = api_client.post(
        f"/api/v1/verifications/"
        f"{verification.id}/decision/",
        {
            "outcome": "APPROVED",
            "summary": "Trying to bypass workflow.",
        },
        format="json",
    )

    assert response.status_code == 400

    verification.refresh_from_db()

    assert verification.status == (
        VerificationStatus.REQUESTED
    )


@pytest.mark.django_db
def test_verifier_can_attach_evidence(
    api_client,
    verifier_user,
    in_progress_verification,
    evidence,
):

    api_client.force_authenticate(
        user=verifier_user
    )

    response = api_client.post(
        f"/api/v1/verifications/"
        f"{in_progress_verification.id}/evidence/",
        {
            "evidence": evidence.id,
            "relevance_note": (
                "Supports ownership verification."
            ),
        },
        format="json",
    )

    assert response.status_code == 201

    assert response.data["evidence"] == (
        evidence.id
    )



def validate(self, attrs):

    verification = attrs[
        "verification"
    ]

    evidence = attrs[
        "evidence"
    ]

    if (
        verification.property_id
        != evidence.property_id
    ):
        raise serializers.ValidationError(
            {
                "evidence": (
                    "Evidence must belong "
                    "to the same property as "
                    "the verification."
                )
            }
        )

    return attrs


@pytest.mark.django_db
def test_finding_is_recorded_by_authenticated_verifier(
    api_client,
    verifier_user,
    in_progress_verification,
):

    api_client.force_authenticate(
        user=verifier_user
    )

    response = api_client.post(
        f"/api/v1/verifications/"
        f"{in_progress_verification.id}/findings/",
        {
            "title": "Ownership mismatch",
            "description": (
                "The submitted information "
                "does not match the observed record."
            ),
            "severity": "HIGH",
        },
        format="json",
    )

    assert response.status_code == 201

    assert response.data["recorded_by"] == (
        verifier_user.id
    )


@pytest.mark.django_db
def test_decision_is_recorded_by_authenticated_reviewer(
    api_client,
    reviewer_user,
    submitted_verification,
):

    api_client.force_authenticate(
        user=reviewer_user
    )

    response = api_client.post(
        f"/api/v1/verifications/"
        f"{submitted_verification.id}/decision/",
        {
            "outcome": "APPROVED",
            "summary": "Verification approved.",
        },
        format="json",
    )

    assert response.status_code == 200

    submitted_verification.refresh_from_db()

    assert (
        submitted_verification.decision
        .decided_by
        == reviewer_user
    )
