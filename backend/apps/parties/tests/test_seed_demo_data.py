from io import StringIO

import pytest
from django.core.management import call_command

from apps.authorization.services import AuthorizationService
from apps.disputes.models import Dispute
from apps.documents.models import Document, Evidence
from apps.due_diligence.models import (
    DueDiligenceFinding,
    DueDiligenceRequest,
    RiskReport,
)
from apps.geospatial.models import (
    PropertyBoundary,
    PropertyLocationRecord,
    SiteRisk,
)
from apps.identity.models import User
from apps.listings.models import Listing, ListingParty
from apps.notifications.models import Notification
from apps.offers.models import Offer, OfferEvent
from apps.parties.constants import PermissionCode
from apps.parties.management.commands.seed_demo_data import (
    DEMO_PASSWORD,
    DEMO_USERS,
)
from apps.parties.models import PartyRole
from apps.payments.models import Payment, Receipt
from apps.properties.models import Project, Property, PropertyParty
from apps.transactions.models import Transaction, TransferChecklistItem


def run_seed_demo_data():
    call_command(
        "seed_demo_data",
        stdout=StringIO(),
    )


@pytest.mark.django_db
def test_seed_demo_data_is_idempotent():
    run_seed_demo_data()
    run_seed_demo_data()

    demo_emails = [
        data["email"]
        for data in DEMO_USERS.values()
    ]

    assert User.objects.filter(
        email__in=demo_emails,
    ).count() == len(DEMO_USERS)
    assert Project.objects.filter(
        name="OWERU Demo Project",
    ).count() == 1
    assert Property.objects.filter(
        reference_number="OWERU-DEMO-LAND-001",
    ).count() == 1
    assert PropertyParty.objects.count() == 2
    assert Listing.objects.filter(
        title="OWERU Demo Kigamboni Plot",
    ).count() == 1
    assert ListingParty.objects.count() == 1
    assert Offer.objects.count() == 1
    assert OfferEvent.objects.count() == 2
    assert Transaction.objects.count() == 1
    assert TransferChecklistItem.objects.count() == 4
    assert Payment.objects.count() == 1
    assert Receipt.objects.count() == 1
    assert Document.objects.count() == 1
    assert Evidence.objects.count() == 1
    assert Dispute.objects.count() == 1
    assert PropertyLocationRecord.objects.count() == 1
    assert PropertyBoundary.objects.count() == 1
    assert SiteRisk.objects.count() == 1
    assert DueDiligenceRequest.objects.count() == 1
    assert RiskReport.objects.count() == 1
    assert DueDiligenceFinding.objects.count() == 1
    assert Notification.objects.count() == 2


@pytest.mark.django_db
def test_seed_demo_users_have_passwords_roles_and_permissions():
    run_seed_demo_data()

    buyer = User.objects.get(
        email=DEMO_USERS["buyer"]["email"],
    )
    seller = User.objects.get(
        email=DEMO_USERS["seller"]["email"],
    )
    verifier = User.objects.get(
        email=DEMO_USERS["verifier"]["email"],
    )

    assert buyer.check_password(
        DEMO_PASSWORD,
    )
    assert PartyRole.objects.filter(
        party=buyer.party,
        role__code="BUYER",
        is_active=True,
    ).exists()
    assert AuthorizationService.has_permission(
        party=buyer.party,
        permission_code=PermissionCode.OFFER_CREATE,
    )
    assert AuthorizationService.has_permission(
        party=seller.party,
        permission_code=PermissionCode.LISTING_CREATE,
    )
    assert AuthorizationService.has_permission(
        party=verifier.party,
        permission_code=PermissionCode.VERIFICATION_PERFORM,
    )
