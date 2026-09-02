import pytest

from apps.audit.models import AuditEvent
from apps.disputes.services import DisputeService
from apps.due_diligence.services import DueDiligenceService
from apps.notifications.models import Notification
from apps.notifications.services import NotificationService
from apps.payments.models import PaymentStatus
from apps.payments.services import PaymentService
from apps.transactions.models import (
    ChecklistItemStatus,
    Transaction,
    TransactionStatus,
)
from apps.transactions.services import TransactionService


@pytest.mark.django_db
def test_transaction_timeline_includes_related_activity(
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
    payment = PaymentService.create_payment(
        party=requester_user.party,
        transaction_obj=transaction,
        validated_data={
            "payee_party": owner_user.party,
            "purpose": "RESERVATION_FEE",
            "amount": "1000000.00",
            "currency": "TZS",
            "method": "MOBILE_MONEY",
        },
    )
    PaymentService.confirm_payment(
        party=admin_user.party,
        payment=payment,
        external_reference="CONFIRMED-123",
    )
    DisputeService.open_dispute(
        party=requester_user.party,
        validated_data={
            "transaction": transaction,
            "category": "TRANSACTION",
            "priority": "HIGH",
            "subject": "Timeline dispute",
            "description": "Need to inspect the transaction history.",
        },
    )

    api_client.force_authenticate(
        user=requester_user,
    )

    response = api_client.get(
        f"/api/v1/transactions/{transaction.id}/timeline/",
    )

    assert response.status_code == 200

    event_types = {
        item["type"]
        for item in response.data
    }

    assert "transaction.initiated" in event_types
    assert "payment.created" in event_types
    assert "payment.confirmed" in event_types
    assert "dispute.opened" in event_types


@pytest.mark.django_db
def test_admin_can_update_transaction_checklist_item(
    api_client,
    admin_user,
    owner_user,
    accepted_offer,
):
    transaction = TransactionService.create_from_offer(
        offer=accepted_offer,
        initiated_by=owner_user,
    )
    checklist_item = transaction.checklist_items.first()

    api_client.force_authenticate(
        user=admin_user,
    )

    response = api_client.post(
        (
            f"/api/v1/transactions/{transaction.id}/checklist-items/"
            f"{checklist_item.id}/transition/"
        ),
        {
            "status": "COMPLETED",
            "notes": "Warranty received.",
        },
        format="json",
    )

    assert response.status_code == 200

    checklist_item.refresh_from_db()

    assert checklist_item.status == ChecklistItemStatus.COMPLETED
    assert checklist_item.completed_by == admin_user
    assert checklist_item.completed_at is not None
    assert AuditEvent.objects.filter(
        action="transaction.checklist_item_updated",
        resource_id=str(checklist_item.id),
    ).exists()


@pytest.mark.django_db
def test_buyer_cannot_update_transaction_checklist_item(
    api_client,
    requester_user,
    owner_user,
    accepted_offer,
):
    transaction = TransactionService.create_from_offer(
        offer=accepted_offer,
        initiated_by=owner_user,
    )
    checklist_item = transaction.checklist_items.first()

    api_client.force_authenticate(
        user=requester_user,
    )

    response = api_client.post(
        (
            f"/api/v1/transactions/{transaction.id}/checklist-items/"
            f"{checklist_item.id}/transition/"
        ),
        {
            "status": "COMPLETED",
        },
        format="json",
    )

    assert response.status_code == 403

    checklist_item.refresh_from_db()

    assert checklist_item.status == ChecklistItemStatus.PENDING


@pytest.mark.django_db
def test_transactions_support_filtering_and_optional_pagination(
    api_client,
    admin_user,
    owner_user,
    accepted_offer,
):
    first_transaction = TransactionService.create_from_offer(
        offer=accepted_offer,
        initiated_by=owner_user,
    )
    first_transaction.status = TransactionStatus.DOCUMENTATION
    first_transaction.save(
        update_fields=[
            "status",
            "updated_at",
        ]
    )

    api_client.force_authenticate(
        user=admin_user,
    )

    response = api_client.get(
        "/api/v1/transactions/?status=DOCUMENTATION",
    )

    assert response.status_code == 200
    assert [
        item["id"]
        for item in response.data
    ] == [
        str(first_transaction.id),
    ]

    response = api_client.get(
        "/api/v1/transactions/?page=1&page_size=1",
    )

    assert response.status_code == 200
    assert response.data["count"] == 1
    assert len(response.data["results"]) == 1


@pytest.mark.django_db
def test_transaction_operations_dashboard_summarizes_party_work(
    api_client,
    admin_user,
    requester_user,
    owner_user,
    accepted_offer,
    owner_property,
):
    transaction = TransactionService.create_from_offer(
        offer=accepted_offer,
        initiated_by=owner_user,
    )
    payment = PaymentService.create_payment(
        party=requester_user.party,
        transaction_obj=transaction,
        validated_data={
            "payee_party": owner_user.party,
            "purpose": "RESERVATION_FEE",
            "amount": "1000000.00",
            "currency": "TZS",
            "method": "MOBILE_MONEY",
        },
    )
    payment.status = PaymentStatus.CONFIRMED
    payment.save(
        update_fields=[
            "status",
            "updated_at",
        ]
    )
    DueDiligenceService.request_due_diligence(
        party=requester_user.party,
        property_obj=owner_property,
        transaction_obj=transaction,
        validated_data={
            "requested_checks": [
                "title",
                "site",
            ],
        },
    )
    NotificationService.notify_party(
        party=requester_user.party,
        title="Dashboard notification",
        message="Unread dashboard notification.",
        actor=admin_user,
    )

    api_client.force_authenticate(
        user=requester_user,
    )

    response = api_client.get(
        "/api/v1/transaction-operations/dashboard/",
    )

    assert response.status_code == 200
    assert response.data["scope"] == "PARTY"
    assert response.data["transactions"]["total"] == 1
    assert response.data["payments"]["total"] == 1
    assert response.data["payments"]["confirmed_total"] == "1000000"
    assert response.data["due_diligence"]["total"] == 1
    assert response.data["notifications"]["unread"] >= 1


@pytest.mark.django_db
def test_dashboard_respects_party_transaction_scope(
    api_client,
    admin_user,
    requester_user,
    owner_user,
    another_verifier_user,
    accepted_offer,
):
    TransactionService.create_from_offer(
        offer=accepted_offer,
        initiated_by=owner_user,
    )

    api_client.force_authenticate(
        user=another_verifier_user,
    )

    response = api_client.get(
        "/api/v1/transaction-operations/dashboard/",
    )

    assert response.status_code == 200
    assert response.data["transactions"]["total"] == 0
    assert response.data["payments"]["total"] == 0

    api_client.force_authenticate(
        user=admin_user,
    )

    response = api_client.get(
        "/api/v1/transaction-operations/dashboard/",
    )

    assert response.status_code == 200
    assert response.data["scope"] == "ADMIN"
    assert response.data["transactions"]["total"] == Transaction.objects.count()
