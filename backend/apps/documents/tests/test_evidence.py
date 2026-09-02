

import pytest


@pytest.mark.django_db
def test_evidence_can_be_recorded(
    api_client,
    verifier_user,
    owner_property,
):

    api_client.force_authenticate(
        user=verifier_user,
    )

    response = api_client.post(
        "/api/v1/evidence/",
        {
            "property": str(
                owner_property.id
            ),
            "source_type": (
                "USER_SUPPLIED"
            ),
            "title": (
                "Ownership document sighted"
            ),
            "description": (
                "Original document was "
                "sighted during inspection."
            ),
        },
        format="json",
    )

    assert response.status_code == 201