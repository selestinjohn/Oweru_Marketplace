import pytest

from apps.authorization.policies import PropertyPolicy
from apps.parties.models import (
    Party,
    PartyType,
    Role,
    PartyRole,
)
from apps.properties.models import (
    Property,
    PropertyParty,
    PropertyPartyRole,
    PropertyType,
    PropertyStatus,
)


@pytest.mark.django_db
def test_owner_can_edit_own_property():

    party = Party.objects.create(
        party_type=PartyType.PERSON,
        display_name="John Doe",
    )

    role = Role.objects.get(
        code="SELLER",
    )

    PartyRole.objects.create(
        party=party,
        role=role,
    )

    property = Property.objects.create(
        reference_number="PROP-001",
        property_type=PropertyType.LAND,
        status=PropertyStatus.DRAFT,
    )

    PropertyParty.objects.create(
        property=property,
        party=party,
        relationship=PropertyPartyRole.OWNER,
        source_type="USER_SUPPLIED",
        started_at="2026-08-25T12:00:00Z",
    )

    assert PropertyPolicy.can_edit(
        party=party,
        property=property,
    )






@pytest.mark.django_db

def test_non_owner_cannot_edit_property():

    # John owns the property

    john = Party.objects.create(

        party_type=PartyType.PERSON,

        display_name="John Doe",

    )

    # Mary is a seller

    mary = Party.objects.create(

        party_type=PartyType.PERSON,

        display_name="Mary Smith",

    )

    seller_role = Role.objects.get(

        code="SELLER",

    )

    PartyRole.objects.create(

        party=mary,

        role=seller_role,

    )

    property = Property.objects.create(

        reference_number="PROP-001",

        property_type=PropertyType.LAND,

        status=PropertyStatus.DRAFT,

    )

    # John owns the property

    PropertyParty.objects.create(

        property=property,

        party=john,

        relationship=PropertyPartyRole.OWNER,

        source_type="USER_SUPPLIED",

        started_at="2026-08-25T12:00:00Z",

    )

    # Mary is NOT the owner

    assert PropertyPolicy.can_edit(

        party=mary,

        property=property,

    ) is False