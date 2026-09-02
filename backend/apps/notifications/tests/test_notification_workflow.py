import pytest

from apps.audit.models import AuditEvent
from apps.notifications.models import Notification, NotificationType
from apps.notifications.services import NotificationService
from apps.payments.models import Payment, PaymentStatus
from apps.transactions.models import TransactionStatus
from apps.transactions.services import TransactionService


@pytest.mark.django_db
def test_user_can_list_and_mark_notification_read(
    api_client,
    requester_user,
):
    notification = NotificationService.notify_party(
        party=requester_user.party,
        title="Verification updated",
        message="Your verification request moved forward.",
        notification_type=NotificationType.VERIFICATION,
        actor=requester_user,
    )

    api_client.force_authenticate(
        user=requester_user,
    )

    response = api_client.get(
        "/api/v1/notifications/",
    )

    assert response.status_code == 200
    assert len(response.data) == 1
    assert response.data[0]["id"] == str(notification.id)

    response = api_client.post(
        f"/api/v1/notifications/{notification.id}/mark-read/",
        {},
        format="json",
    )

    assert response.status_code == 200

    notification.refresh_from_db()

    assert notification.read_at is not None
    assert AuditEvent.objects.filter(
        action="notification.created",
        resource_id=str(notification.id),
    ).exists()


@pytest.mark.django_db
def test_archived_notifications_are_hidden_by_default(
    api_client,
    requester_user,
):
    notification = NotificationService.notify_party(
        party=requester_user.party,
        title="System note",
        message="A notification that can be archived.",
        notification_type=NotificationType.SYSTEM,
        actor=requester_user,
    )

    api_client.force_authenticate(
        user=requester_user,
    )

    response = api_client.post(
        f"/api/v1/notifications/{notification.id}/archive/",
        {},
        format="json",
    )

    assert response.status_code == 200

    response = api_client.get(
        "/api/v1/notifications/",
    )

    assert response.status_code == 200
    assert response.data == []

    response = api_client.get(
        "/api/v1/notifications/?include_archived=true",
    )

    assert response.status_code == 200
    assert len(response.data) == 1


@pytest.mark.django_db
def test_payment_confirmation_notifies_payer(
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
        },
        format="json",
    )

    assert response.status_code == 200
    assert Notification.objects.filter(
        recipient_user=requester_user,
        notification_type=NotificationType.PAYMENT,
        resource_id=str(payment.id),
    ).exists()
