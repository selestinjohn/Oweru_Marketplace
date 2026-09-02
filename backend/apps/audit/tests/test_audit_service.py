import pytest

from apps.audit.models import AuditCategory, AuditEvent
from apps.audit.services import AuditService
from apps.properties.models import Property, PropertyType


@pytest.mark.django_db
def test_audit_service_records_actor_resource_and_metadata(
    admin_user,
):
    property = Property.objects.create(
        reference_number="OWERU-AUDIT-001",
        property_type=PropertyType.LAND,
    )

    event = AuditService.record(
        actor=admin_user,
        action="property.created",
        category=AuditCategory.PROPERTY,
        resource=property,
        summary="Property created.",
        after={
            "reference_number": property.reference_number,
        },
        metadata={
            "source": "test",
        },
    )

    assert AuditEvent.objects.count() == 1
    assert event.actor == admin_user
    assert event.resource_type == "properties.Property"
    assert event.resource_id == str(property.id)
    assert event.after["reference_number"] == "OWERU-AUDIT-001"
    assert event.metadata["source"] == "test"
