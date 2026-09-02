import pytest

from apps.identity.models import User
from apps.parties.models import (
    Party,
    PartyRole,
    PartyType,
    Role,
)
from apps.properties.models import (
    Property,
    PropertyParty,
    PropertyPartyRole,
    PropertyType,
    SourceType,
)


@pytest.fixture
def owner_user(db):

    user = User.objects.create_user(
        email="owner@example.com",
        password="StrongPassword123!",
    )

    party = Party.objects.create(
        user=user,
        party_type=PartyType.PERSON,
        display_name="Owner User",
    )

    role = Role.objects.get(
        code="SELLER"
    )

    PartyRole.objects.create(
        party=party,
        role=role,
    )

    return user


@pytest.fixture
def another_user(db):

    user = User.objects.create_user(
        email="another@example.com",
        password="StrongPassword123!",
    )

    party = Party.objects.create(
        user=user,
        party_type=PartyType.PERSON,
        display_name="Another User",
    )

    role = Role.objects.get(
        code="SELLER"
    )

    PartyRole.objects.create(
        party=party,
        role=role,
    )

    return user


@pytest.fixture
def owner_property(
    db,
    owner_user,
):

    property = Property.objects.create(
        reference_number="OWERU-DOC-001",
        property_type=PropertyType.LAND,
    )

    PropertyParty.objects.create(
        property=property,
        party=owner_user.party,
        relationship=PropertyPartyRole.OWNER,
        source_type=SourceType.USER_SUPPLIED,
        started_at="2026-08-28T10:00:00Z",
    )

    return property
