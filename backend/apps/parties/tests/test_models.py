import pytest

from apps.parties.models import Party, PartyType
from apps.parties.serializers import PartyPublicSerializer

@pytest.mark.django_db
def test_party_can_be_created():
    party = Party.objects.create(
        party_type=PartyType.PERSON,
        display_name="John Doe",
    )

    assert party.display_name == "John Doe"
    assert party.party_type == PartyType.PERSON



@pytest.mark.django_db

def test_public_party_serializer_does_not_expose_sensitive_information():

    party = Party.objects.create(

        party_type=PartyType.PERSON,

        display_name="John Doe",

    )

    data = PartyPublicSerializer(party).data

    assert data["id"] == party.id

    assert data["display_name"] == "John Doe"

    assert data["party_type"] == PartyType.PERSON

    assert "identity_status" not in data

    assert "tax_status" not in data