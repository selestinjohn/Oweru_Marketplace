import pytest

from apps.audit.models import AuditEvent
from apps.disputes.models import (
    Dispute,
    DisputeEvidence,
    DisputeMessage,
    DisputeStatus,
)
from apps.transactions.models import TransactionStatus
from apps.transactions.services import TransactionService


@pytest.mark.django_db
def test_buyer_can_open_transaction_dispute(
    api_client,
    requester_user,
    owner_user,
    accepted_offer,
):
    transaction = TransactionService.create_from_offer(
        offer=accepted_offer,
        initiated_by=owner_user,
    )

    api_client.force_authenticate(
        user=requester_user,
    )

    response = api_client.post(
        "/api/v1/disputes/",
        {
            "transaction": str(transaction.id),
            "category": "TRANSACTION",
            "priority": "HIGH",
            "subject": "Transfer terms need review",
            "description": "The transfer timeline no longer matches terms.",
        },
        format="json",
    )

    assert response.status_code == 201

    dispute = Dispute.objects.get()
    transaction.refresh_from_db()

    assert dispute.opened_by_party == requester_user.party
    assert dispute.status == DisputeStatus.OPEN
    assert transaction.status == TransactionStatus.DISPUTED
    assert AuditEvent.objects.filter(
        action="dispute.opened",
        resource_id=str(dispute.id),
    ).exists()


@pytest.mark.django_db
def test_admin_can_review_resolve_and_close_dispute(
    api_client,
    admin_user,
    requester_user,
    owner_user,
    accepted_offer,
):
    transaction = TransactionService.create_from_offer(
        offer=accepted_offer,
        initiated_by=owner_user,
    )

    dispute = Dispute.objects.create(
        transaction=transaction,
        listing=transaction.listing,
        property=transaction.property,
        opened_by_party=requester_user.party,
        opened_by=requester_user,
        category="TRANSACTION",
        priority="MEDIUM",
        subject="Transfer terms need review",
        description="Review requested.",
    )
    TransactionService.transition_system(
        transaction_obj=transaction,
        new_status=TransactionStatus.DISPUTED,
        actor=requester_user,
    )

    api_client.force_authenticate(
        user=admin_user,
    )

    response = api_client.post(
        f"/api/v1/disputes/{dispute.id}/review/",
        {
            "notes": "Ops is reviewing.",
        },
        format="json",
    )

    assert response.status_code == 200

    response = api_client.post(
        f"/api/v1/disputes/{dispute.id}/resolve/",
        {
            "resolution_summary": "Parties agreed to continue.",
            "next_transaction_status": "DOCUMENTATION",
        },
        format="json",
    )

    assert response.status_code == 200

    response = api_client.post(
        f"/api/v1/disputes/{dispute.id}/close/",
        {},
        format="json",
    )

    assert response.status_code == 200

    dispute.refresh_from_db()
    transaction.refresh_from_db()

    assert dispute.status == DisputeStatus.CLOSED
    assert dispute.resolved_by == admin_user
    assert dispute.closed_at is not None
    assert transaction.status == TransactionStatus.DOCUMENTATION


@pytest.mark.django_db
def test_participant_can_add_dispute_message_and_evidence(
    api_client,
    requester_user,
    owner_user,
    accepted_offer,
    document,
):
    transaction = TransactionService.create_from_offer(
        offer=accepted_offer,
        initiated_by=owner_user,
    )

    dispute = Dispute.objects.create(
        transaction=transaction,
        listing=transaction.listing,
        property=transaction.property,
        opened_by_party=requester_user.party,
        opened_by=requester_user,
        category="DOCUMENT",
        priority="MEDIUM",
        subject="Document clarification",
        description="The uploaded document needs context.",
    )

    api_client.force_authenticate(
        user=requester_user,
    )

    response = api_client.post(
        f"/api/v1/disputes/{dispute.id}/messages/",
        {
            "message": "Please review this before transfer.",
        },
        format="json",
    )

    assert response.status_code == 201

    response = api_client.post(
        f"/api/v1/disputes/{dispute.id}/evidence/",
        {
            "document": str(document.id),
            "title": "Uploaded title copy",
            "description": "Attached for dispute review.",
        },
        format="json",
    )

    assert response.status_code == 201
    assert DisputeMessage.objects.filter(
        dispute=dispute,
    ).exists()
    assert DisputeEvidence.objects.filter(
        dispute=dispute,
        document=document,
    ).exists()


@pytest.mark.django_db
def test_unrelated_party_cannot_view_dispute(
    api_client,
    requester_user,
    owner_user,
    another_verifier_user,
    accepted_offer,
):
    transaction = TransactionService.create_from_offer(
        offer=accepted_offer,
        initiated_by=owner_user,
    )

    dispute = Dispute.objects.create(
        transaction=transaction,
        listing=transaction.listing,
        property=transaction.property,
        opened_by_party=requester_user.party,
        opened_by=requester_user,
        category="TRANSACTION",
        priority="MEDIUM",
        subject="Transfer terms need review",
        description="Review requested.",
    )

    api_client.force_authenticate(
        user=another_verifier_user,
    )

    response = api_client.get(
        f"/api/v1/disputes/{dispute.id}/",
    )

    assert response.status_code == 404
