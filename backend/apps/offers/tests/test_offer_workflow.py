import pytest

from apps.audit.models import AuditEvent
from apps.offers.models import Offer, OfferEvent, OfferStatus
from apps.properties.models import PropertyStatus


@pytest.mark.django_db
def test_buyer_can_create_offer_on_published_listing(
    api_client,
    requester_user,
    published_listing,
):
    api_client.force_authenticate(
        user=requester_user,
    )

    response = api_client.post(
        "/api/v1/offers/",
        {
            "listing": str(published_listing.id),
            "amount": "9000000.00",
            "currency": "TZS",
            "message": "I am interested.",
        },
        format="json",
    )

    assert response.status_code == 201

    offer = Offer.objects.get()

    assert offer.buyer_party == requester_user.party
    assert offer.status == OfferStatus.PENDING
    assert OfferEvent.objects.filter(
        offer=offer,
        event_type="CREATED",
    ).exists()
    assert AuditEvent.objects.filter(
        action="offer.created",
        resource_id=str(offer.id),
    ).exists()


@pytest.mark.django_db
def test_owner_cannot_offer_on_own_listing(
    api_client,
    owner_user,
    published_listing,
):
    api_client.force_authenticate(
        user=owner_user,
    )

    response = api_client.post(
        "/api/v1/offers/",
        {
            "listing": str(published_listing.id),
            "amount": "9000000.00",
            "currency": "TZS",
        },
        format="json",
    )

    assert response.status_code == 403
    assert not Offer.objects.exists()


@pytest.mark.django_db
def test_owner_can_accept_offer_and_mark_property_under_offer(
    api_client,
    requester_user,
    owner_user,
    published_listing,
):
    offer = Offer.objects.create(
        listing=published_listing,
        buyer_party=requester_user.party,
        amount="9000000.00",
        currency="TZS",
        created_by=requester_user,
    )

    api_client.force_authenticate(
        user=owner_user,
    )

    response = api_client.post(
        f"/api/v1/offers/{offer.id}/accept/",
        {
            "message": "Accepted.",
        },
        format="json",
    )

    assert response.status_code == 200

    offer.refresh_from_db()
    published_listing.property.refresh_from_db()

    assert offer.status == OfferStatus.ACCEPTED
    assert published_listing.property.status == (
        PropertyStatus.UNDER_OFFER
    )
    assert OfferEvent.objects.filter(
        offer=offer,
        event_type="ACCEPTED",
    ).exists()


@pytest.mark.django_db
def test_unrelated_buyer_cannot_accept_offer(
    api_client,
    requester_user,
    another_verifier_user,
    published_listing,
):
    offer = Offer.objects.create(
        listing=published_listing,
        buyer_party=requester_user.party,
        amount="9000000.00",
        currency="TZS",
        created_by=requester_user,
    )

    api_client.force_authenticate(
        user=another_verifier_user,
    )

    response = api_client.post(
        f"/api/v1/offers/{offer.id}/accept/",
        {},
        format="json",
    )

    assert response.status_code == 404

    offer.refresh_from_db()

    assert offer.status == OfferStatus.PENDING


@pytest.mark.django_db
def test_owner_can_counter_offer(
    api_client,
    requester_user,
    owner_user,
    published_listing,
):
    offer = Offer.objects.create(
        listing=published_listing,
        buyer_party=requester_user.party,
        amount="9000000.00",
        currency="TZS",
        created_by=requester_user,
    )

    api_client.force_authenticate(
        user=owner_user,
    )

    response = api_client.post(
        f"/api/v1/offers/{offer.id}/counter/",
        {
            "amount": "9500000.00",
            "currency": "TZS",
            "message": "Can you meet me here?",
        },
        format="json",
    )

    assert response.status_code == 200

    offer.refresh_from_db()

    assert offer.status == OfferStatus.COUNTERED
    assert str(offer.amount) == "9500000.00"
    assert OfferEvent.objects.filter(
        offer=offer,
        event_type="COUNTERED",
    ).exists()


@pytest.mark.django_db
def test_buyer_can_withdraw_active_offer(
    api_client,
    requester_user,
    published_listing,
):
    offer = Offer.objects.create(
        listing=published_listing,
        buyer_party=requester_user.party,
        amount="9000000.00",
        currency="TZS",
        created_by=requester_user,
    )

    api_client.force_authenticate(
        user=requester_user,
    )

    response = api_client.post(
        f"/api/v1/offers/{offer.id}/withdraw/",
        {
            "message": "I found another property.",
        },
        format="json",
    )

    assert response.status_code == 200

    offer.refresh_from_db()

    assert offer.status == OfferStatus.WITHDRAWN
    assert offer.withdrawn_at is not None
