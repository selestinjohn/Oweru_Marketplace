import pytest
from django.utils import timezone

from apps.audit.models import AuditEvent
from apps.due_diligence.models import (
    DueDiligenceFinding,
    DueDiligenceRequest,
    DueDiligenceStatus,
    RiskReport,
)
from apps.geospatial.models import SiteRisk
from apps.identity.models import User
from apps.notifications.models import Notification, NotificationType
from apps.parties.models import Party, PartyRole, PartyType, Role
from apps.properties.models import SourceType


@pytest.mark.django_db
def test_buyer_can_request_due_diligence(
    api_client,
    requester_user,
    owner_user,
    owner_property,
):
    api_client.force_authenticate(
        user=requester_user,
    )

    response = api_client.post(
        "/api/v1/due-diligence-requests/",
        {
            "property": str(owner_property.id),
            "requested_checks": [
                "title",
                "site",
                "party",
            ],
            "notes": "Please review title and site risks.",
        },
        format="json",
    )

    assert response.status_code == 201

    due_diligence_request = DueDiligenceRequest.objects.get()

    assert due_diligence_request.requested_by_party == requester_user.party
    assert due_diligence_request.status == DueDiligenceStatus.REQUESTED
    assert AuditEvent.objects.filter(
        action="due_diligence.requested",
        resource_id=str(due_diligence_request.id),
    ).exists()
    assert Notification.objects.filter(
        recipient_user=owner_user,
        notification_type=NotificationType.DUE_DILIGENCE,
    ).exists()


@pytest.mark.django_db
def test_verifier_can_submit_risk_report_with_geospatial_snapshot(
    api_client,
    requester_user,
    verifier_user,
    owner_property,
):
    SiteRisk.objects.create(
        property=owner_property,
        risk_type="ACCESS",
        severity="HIGH",
        source_type=SourceType.OWERU_ESTABLISHED,
        description="Access road requires confirmation.",
        recorded_by=verifier_user,
    )
    due_diligence_request = DueDiligenceRequest.objects.create(
        property=owner_property,
        requested_by_party=requester_user.party,
        requested_by=requester_user,
        requested_checks=[
            "site",
            "title",
        ],
    )

    api_client.force_authenticate(
        user=verifier_user,
    )

    response = api_client.post(
        f"/api/v1/due-diligence-requests/{due_diligence_request.id}/start-review/",
        {},
        format="json",
    )

    assert response.status_code == 200

    response = api_client.post(
        f"/api/v1/due-diligence-requests/{due_diligence_request.id}/submit-report/",
        {
            "outcome": "HIGH_RISK",
            "summary": "Proceed only after access documents are verified.",
            "geospatial_summary": "Site access has an unresolved risk.",
            "evidence_summary": {
                "documents_reviewed": 2,
            },
            "findings": [
                {
                    "category": "GEOSPATIAL",
                    "severity": "HIGH",
                    "title": "Access road not confirmed",
                    "description": "The access path needs official proof.",
                    "recommendation": "Collect road reserve documentation.",
                }
            ],
        },
        format="json",
    )

    assert response.status_code == 201

    due_diligence_request.refresh_from_db()
    report = RiskReport.objects.get()

    assert due_diligence_request.status == DueDiligenceStatus.SUBMITTED
    assert report.prepared_by == verifier_user
    assert report.evidence_summary["geospatial_snapshot"][
        "high_site_risk_count"
    ] == 1
    assert DueDiligenceFinding.objects.filter(
        due_diligence_request=due_diligence_request,
        severity="HIGH",
    ).exists()
    assert Notification.objects.filter(
        recipient_user=requester_user,
        notification_type=NotificationType.DUE_DILIGENCE,
        resource_id=str(due_diligence_request.id),
    ).exists()


@pytest.mark.django_db
def test_admin_can_approve_submitted_due_diligence(
    api_client,
    admin_user,
    requester_user,
    verifier_user,
    owner_property,
):
    due_diligence_request = DueDiligenceRequest.objects.create(
        property=owner_property,
        requested_by_party=requester_user.party,
        requested_by=requester_user,
        assigned_reviewer=verifier_user,
        status=DueDiligenceStatus.SUBMITTED,
        submitted_at=timezone.now(),
    )
    RiskReport.objects.create(
        due_diligence_request=due_diligence_request,
        outcome="LOW_RISK",
        summary="No blocking risks found.",
        prepared_by=verifier_user,
    )

    api_client.force_authenticate(
        user=admin_user,
    )

    response = api_client.post(
        f"/api/v1/due-diligence-requests/{due_diligence_request.id}/decide/",
        {
            "status": "APPROVED",
            "decision_notes": "Approved for transaction support.",
        },
        format="json",
    )

    assert response.status_code == 200

    due_diligence_request.refresh_from_db()

    assert due_diligence_request.status == DueDiligenceStatus.APPROVED
    assert due_diligence_request.decided_by == admin_user
    assert due_diligence_request.decided_at is not None


@pytest.mark.django_db
def test_buyer_cannot_submit_risk_report(
    api_client,
    requester_user,
    owner_property,
):
    due_diligence_request = DueDiligenceRequest.objects.create(
        property=owner_property,
        requested_by_party=requester_user.party,
        requested_by=requester_user,
    )

    api_client.force_authenticate(
        user=requester_user,
    )

    response = api_client.post(
        f"/api/v1/due-diligence-requests/{due_diligence_request.id}/submit-report/",
        {
            "outcome": "LOW_RISK",
            "summary": "Looks good.",
        },
        format="json",
    )

    assert response.status_code == 403
    assert not RiskReport.objects.exists()


@pytest.mark.django_db
def test_unrelated_buyer_cannot_view_due_diligence_request(
    api_client,
    requester_user,
    owner_property,
):
    other_user = User.objects.create_user(
        email="other-buyer@example.com",
        password="StrongPassword123!",
    )
    other_party = Party.objects.create(
        user=other_user,
        party_type=PartyType.PERSON,
        display_name="Other Buyer",
    )
    PartyRole.objects.create(
        party=other_party,
        role=Role.objects.get(code="BUYER"),
    )

    due_diligence_request = DueDiligenceRequest.objects.create(
        property=owner_property,
        requested_by_party=requester_user.party,
        requested_by=requester_user,
    )

    api_client.force_authenticate(
        user=other_user,
    )

    response = api_client.get(
        f"/api/v1/due-diligence-requests/{due_diligence_request.id}/",
    )

    assert response.status_code == 404
