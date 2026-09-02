import pytest

from apps.audit.models import AuditCategory
from apps.audit.services import AuditService


@pytest.mark.django_db
def test_admin_can_list_audit_events(
    api_client,
    admin_user,
    owner_property,
):
    AuditService.record(
        actor=admin_user,
        action="property.created",
        category=AuditCategory.PROPERTY,
        resource=owner_property,
    )

    api_client.force_authenticate(
        user=admin_user,
    )

    response = api_client.get(
        "/api/v1/audit-events/",
    )

    assert response.status_code == 200
    assert len(response.data) == 1
    assert response.data[0]["action"] == "property.created"


@pytest.mark.django_db
def test_non_admin_cannot_list_audit_events(
    api_client,
    requester_user,
):
    api_client.force_authenticate(
        user=requester_user,
    )

    response = api_client.get(
        "/api/v1/audit-events/",
    )

    assert response.status_code == 403
