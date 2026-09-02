import pytest

from apps.audit.models import AuditEvent
from apps.offers.models import Offer, OfferStatus
from apps.offers.services import OfferService
from apps.transactions.models import Transaction, TransactionStatus
from apps.transactions.services import TransactionService


@pytest.mark.django_db
def test_transaction_is_created_from_accepted_offer(
    accepted_offer,
    owner_user,
):
    transaction = TransactionService.create_from_offer(
        offer=accepted_offer,
        initiated_by=owner_user,
    )

    assert transaction.status == TransactionStatus.INITIATED
    assert transaction.offer == accepted_offer
    assert transaction.buyer_party == accepted_offer.buyer_party
    assert transaction.seller_party == owner_user.party
    assert transaction.checklist_items.count() == 4
    assert AuditEvent.objects.filter(
        action="transaction.initiated",
        resource_id=str(transaction.id),
    ).exists()


@pytest.mark.django_db
def test_accepting_offer_starts_transaction(
    requester_user,
    owner_user,
    published_listing,
):
    offer = Offer.objects.create(
        listing=published_listing,
        buyer_party=requester_user.party,
        amount="9000000.00",
        currency="TZS",
        status=OfferStatus.PENDING,
        created_by=requester_user,
    )

    OfferService.accept_offer(
        party=owner_user.party,
        offer=offer,
    )

    assert Transaction.objects.filter(
        offer=offer,
        status=TransactionStatus.INITIATED,
    ).exists()


@pytest.mark.django_db
def test_buyer_can_list_own_transactions(
    api_client,
    accepted_offer,
    requester_user,
    owner_user,
):
    transaction = TransactionService.create_from_offer(
        offer=accepted_offer,
        initiated_by=owner_user,
    )

    api_client.force_authenticate(
        user=requester_user,
    )

    response = api_client.get(
        "/api/v1/transactions/",
    )

    assert response.status_code == 200
    assert response.data[0]["id"] == str(transaction.id)


@pytest.mark.django_db
def test_unrelated_user_cannot_retrieve_transaction(
    api_client,
    accepted_offer,
    owner_user,
    another_verifier_user,
):
    transaction = TransactionService.create_from_offer(
        offer=accepted_offer,
        initiated_by=owner_user,
    )

    api_client.force_authenticate(
        user=another_verifier_user,
    )

    response = api_client.get(
        f"/api/v1/transactions/{transaction.id}/",
    )

    assert response.status_code == 404
