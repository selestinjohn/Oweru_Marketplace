import pytest

from apps.audit.models import AuditEvent
from apps.payments.models import Payment, PaymentStatus, Receipt
from apps.transactions.models import TransactionStatus
from apps.transactions.services import TransactionService


@pytest.mark.django_db
def test_buyer_can_create_payment_record(
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
        "/api/v1/payments/",
        {
            "transaction": str(transaction.id),
            "payee_party": str(owner_user.party.id),
            "purpose": "RESERVATION_FEE",
            "amount": "1000000.00",
            "currency": "TZS",
            "method": "MOBILE_MONEY",
            "external_reference": "MPESA-123",
        },
        format="json",
    )

    assert response.status_code == 201

    payment = Payment.objects.get()
    transaction.refresh_from_db()

    assert payment.status == PaymentStatus.INITIATED
    assert payment.payer_party == requester_user.party
    assert transaction.status == TransactionStatus.PENDING_PAYMENT
    assert AuditEvent.objects.filter(
        action="payment.created",
        resource_id=str(payment.id),
    ).exists()


@pytest.mark.django_db
def test_admin_can_confirm_payment_and_issue_receipt(
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

    payment = Payment.objects.create(
        transaction=transaction,
        payer_party=requester_user.party,
        payee_party=owner_user.party,
        purpose="RESERVATION_FEE",
        amount="1000000.00",
        currency="TZS",
        method="MOBILE_MONEY",
        status=PaymentStatus.INITIATED,
        initiated_by=requester_user,
    )

    TransactionService.transition_system(
        transaction_obj=transaction,
        new_status=TransactionStatus.PENDING_PAYMENT,
        actor=requester_user,
    )

    api_client.force_authenticate(
        user=admin_user,
    )

    response = api_client.post(
        f"/api/v1/payments/{payment.id}/confirm/",
        {
            "external_reference": "CONFIRMED-123",
            "notes": "Payment confirmed by operations.",
        },
        format="json",
    )

    assert response.status_code == 200

    payment.refresh_from_db()
    transaction.refresh_from_db()

    assert payment.status == PaymentStatus.CONFIRMED
    assert payment.confirmed_by == admin_user
    assert Receipt.objects.filter(
        payment=payment,
    ).exists()
    assert transaction.status == TransactionStatus.PAYMENT_COMPLETED


@pytest.mark.django_db
def test_admin_can_transition_transaction_to_documentation_and_complete(
    api_client,
    admin_user,
    accepted_offer,
    owner_user,
):
    transaction = TransactionService.create_from_offer(
        offer=accepted_offer,
        initiated_by=owner_user,
    )

    TransactionService.transition_system(
        transaction_obj=transaction,
        new_status=TransactionStatus.PENDING_PAYMENT,
        actor=owner_user,
    )
    TransactionService.transition_system(
        transaction_obj=transaction,
        new_status=TransactionStatus.PAYMENT_COMPLETED,
        actor=owner_user,
    )

    api_client.force_authenticate(
        user=admin_user,
    )

    response = api_client.post(
        f"/api/v1/transactions/{transaction.id}/transition/",
        {
            "status": "DOCUMENTATION",
            "notes": "Documents are being prepared.",
        },
        format="json",
    )

    assert response.status_code == 200

    response = api_client.post(
        f"/api/v1/transactions/{transaction.id}/transition/",
        {
            "status": "COMPLETED",
            "notes": "Transfer support completed.",
        },
        format="json",
    )

    assert response.status_code == 200

    transaction.refresh_from_db()
    transaction.property.refresh_from_db()

    assert transaction.status == TransactionStatus.COMPLETED
    assert transaction.completed_at is not None
    assert transaction.property.status == "SOLD"


@pytest.mark.django_db
def test_invalid_transaction_transition_is_rejected(
    api_client,
    admin_user,
    accepted_offer,
    owner_user,
):
    transaction = TransactionService.create_from_offer(
        offer=accepted_offer,
        initiated_by=owner_user,
    )

    api_client.force_authenticate(
        user=admin_user,
    )

    response = api_client.post(
        f"/api/v1/transactions/{transaction.id}/transition/",
        {
            "status": "COMPLETED",
        },
        format="json",
    )

    assert response.status_code == 400

    transaction.refresh_from_db()

    assert transaction.status == TransactionStatus.INITIATED
