import pytest
from django.utils import timezone

from apps.disputes.models import Dispute
from apps.due_diligence.models import (
    DueDiligenceRequest,
    DueDiligenceStatus,
)
from apps.geospatial.models import SiteRisk
from apps.listings.models import (
    Listing,
    ListingParty,
    ListingPartyRelationship,
    ListingStatus,
)
from apps.notifications.models import NotificationType
from apps.notifications.services import NotificationService
from apps.offers.models import Offer, OfferStatus
from apps.payments.models import Payment, PaymentStatus
from apps.properties.models import SourceType
from apps.transactions.services import TransactionService


def create_transaction(
    *,
    requester_user,
    owner_user,
    owner_property,
):
    listing = Listing.objects.create(
        property=owner_property,
        title="Operational API Listing",
        description="A listing for operational API tests.",
        price="10000000.00",
        currency="TZS",
        status=ListingStatus.PUBLISHED,
    )
    ListingParty.objects.create(
        listing=listing,
        party=owner_user.party,
        relationship=ListingPartyRelationship.OWNER,
        is_active=True,
    )
    offer = Offer.objects.create(
        listing=listing,
        buyer_party=requester_user.party,
        amount="9000000.00",
        currency="TZS",
        status=OfferStatus.ACCEPTED,
        created_by=requester_user,
        responded_by=owner_user,
    )

    return TransactionService.create_from_offer(
        offer=offer,
        initiated_by=owner_user,
    )


@pytest.mark.django_db
def test_payment_list_supports_filters_and_optional_pagination(
    api_client,
    admin_user,
    requester_user,
    owner_user,
    owner_property,
):
    transaction = create_transaction(
        requester_user=requester_user,
        owner_user=owner_user,
        owner_property=owner_property,
    )
    Payment.objects.create(
        transaction=transaction,
        payer_party=requester_user.party,
        payee_party=owner_user.party,
        purpose="RESERVATION_FEE",
        amount="1000000.00",
        currency="TZS",
        method="MOBILE_MONEY",
        status=PaymentStatus.CONFIRMED,
        initiated_by=requester_user,
    )
    Payment.objects.create(
        transaction=transaction,
        payer_party=requester_user.party,
        payee_party=owner_user.party,
        purpose="DUE_DILIGENCE_FEE",
        amount="500000.00",
        currency="TZS",
        method="BANK_TRANSFER",
        status=PaymentStatus.FAILED,
        initiated_by=requester_user,
    )

    api_client.force_authenticate(
        user=admin_user,
    )

    response = api_client.get(
        "/api/v1/payments/?status=CONFIRMED",
    )

    assert response.status_code == 200
    assert len(response.data) == 1
    assert response.data[0]["status"] == "CONFIRMED"

    response = api_client.get(
        "/api/v1/payments/?page=1&page_size=1",
    )

    assert response.status_code == 200
    assert response.data["count"] == 2
    assert len(response.data["results"]) == 1


@pytest.mark.django_db
def test_dispute_list_supports_search_and_optional_pagination(
    api_client,
    admin_user,
    requester_user,
    owner_user,
    owner_property,
):
    transaction = create_transaction(
        requester_user=requester_user,
        owner_user=owner_user,
        owner_property=owner_property,
    )
    Dispute.objects.create(
        transaction=transaction,
        listing=transaction.listing,
        property=transaction.property,
        opened_by_party=requester_user.party,
        opened_by=requester_user,
        category="TRANSACTION",
        priority="HIGH",
        subject="Boundary timeline dispute",
        description="Review the boundary history.",
    )
    Dispute.objects.create(
        transaction=transaction,
        listing=transaction.listing,
        property=transaction.property,
        opened_by_party=owner_user.party,
        opened_by=owner_user,
        category="PAYMENT",
        priority="LOW",
        subject="Payment clarification",
        description="Review payment support.",
    )

    api_client.force_authenticate(
        user=admin_user,
    )

    response = api_client.get(
        "/api/v1/disputes/?search=Boundary",
    )

    assert response.status_code == 200
    assert len(response.data) == 1
    assert response.data[0]["subject"] == "Boundary timeline dispute"

    response = api_client.get(
        "/api/v1/disputes/?page=1&page_size=1",
    )

    assert response.status_code == 200
    assert response.data["count"] == 2
    assert len(response.data["results"]) == 1


@pytest.mark.django_db
def test_notifications_support_type_unread_and_optional_pagination(
    api_client,
    requester_user,
):
    read_notification = NotificationService.notify_party(
        party=requester_user.party,
        title="Payment note",
        message="A payment notification.",
        notification_type=NotificationType.PAYMENT,
        actor=requester_user,
    )
    read_notification.read_at = timezone.now()
    read_notification.save(
        update_fields=[
            "read_at",
            "updated_at",
        ]
    )
    NotificationService.notify_party(
        party=requester_user.party,
        title="Dispute note",
        message="A dispute notification.",
        notification_type=NotificationType.DISPUTE,
        actor=requester_user,
    )

    api_client.force_authenticate(
        user=requester_user,
    )

    response = api_client.get(
        "/api/v1/notifications/?unread=true",
    )

    assert response.status_code == 200
    assert len(response.data) == 1
    assert response.data[0]["notification_type"] == "DISPUTE"

    response = api_client.get(
        "/api/v1/notifications/?notification_type=PAYMENT",
    )

    assert response.status_code == 200
    assert len(response.data) == 1

    response = api_client.get(
        "/api/v1/notifications/?page=1&page_size=1",
    )

    assert response.status_code == 200
    assert response.data["count"] == 2
    assert len(response.data["results"]) == 1


@pytest.mark.django_db
def test_geospatial_site_risk_list_supports_filters_and_pagination(
    api_client,
    admin_user,
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
    SiteRisk.objects.create(
        property=owner_property,
        risk_type="FLOOD",
        severity="LOW",
        source_type=SourceType.OWERU_ESTABLISHED,
        description="Flood risk is low.",
        recorded_by=verifier_user,
    )

    api_client.force_authenticate(
        user=admin_user,
    )

    response = api_client.get(
        "/api/v1/site-risks/?severity=HIGH",
    )

    assert response.status_code == 200
    assert len(response.data) == 1
    assert response.data[0]["risk_type"] == "ACCESS"

    response = api_client.get(
        "/api/v1/site-risks/?page=1&page_size=1",
    )

    assert response.status_code == 200
    assert response.data["count"] == 2
    assert len(response.data["results"]) == 1


@pytest.mark.django_db
def test_due_diligence_list_supports_filters_and_pagination(
    api_client,
    admin_user,
    requester_user,
    owner_property,
):
    DueDiligenceRequest.objects.create(
        property=owner_property,
        requested_by_party=requester_user.party,
        requested_by=requester_user,
        status=DueDiligenceStatus.REQUESTED,
    )
    DueDiligenceRequest.objects.create(
        property=owner_property,
        requested_by_party=requester_user.party,
        requested_by=requester_user,
        status=DueDiligenceStatus.SUBMITTED,
    )

    api_client.force_authenticate(
        user=admin_user,
    )

    response = api_client.get(
        "/api/v1/due-diligence-requests/?status=SUBMITTED",
    )

    assert response.status_code == 200
    assert len(response.data) == 1
    assert response.data[0]["status"] == "SUBMITTED"

    response = api_client.get(
        "/api/v1/due-diligence-requests/?page=1&page_size=1",
    )

    assert response.status_code == 200
    assert response.data["count"] == 2
    assert len(response.data["results"]) == 1
