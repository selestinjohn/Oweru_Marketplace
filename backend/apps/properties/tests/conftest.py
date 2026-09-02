import pytest

from apps.identity.models import User
from apps.parties.models import Party, PartyRole, PartyType, Role


@pytest.fixture
def seller_user(db):
    user = User.objects.create_user(
        email="seller-fixture@example.com",
        password="StrongPassword123!",
    )

    party = Party.objects.create(
        user=user,
        party_type=PartyType.PERSON,
        display_name="Seller Fixture",
    )

    seller = Role.objects.get(
        code="SELLER",
    )

    PartyRole.objects.create(
        party=party,
        role=seller,
    )

    return user