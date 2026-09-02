import pytest

from apps.audit.models import AuditEvent
from apps.geospatial.models import (
    PropertyBoundary,
    PropertyLocationRecord,
    SiteRisk,
)
from apps.notifications.models import Notification, NotificationType


@pytest.mark.django_db
def test_verifier_can_record_property_boundary(
    api_client,
    verifier_user,
    owner_user,
    owner_property,
):
    api_client.force_authenticate(
        user=verifier_user,
    )

    response = api_client.post(
        "/api/v1/property-boundaries/",
        {
            "property": str(owner_property.id),
            "boundary_type": "PARCEL",
            "source_type": "OWERU_ESTABLISHED",
            "coordinates": [
                {
                    "latitude": -6.8000,
                    "longitude": 39.2500,
                },
                {
                    "latitude": -6.8000,
                    "longitude": 39.2600,
                },
                {
                    "latitude": -6.8100,
                    "longitude": 39.2600,
                },
            ],
            "area_square_meters": "1200.00",
            "notes": "Boundary checked on site.",
        },
        format="json",
    )

    assert response.status_code == 201

    boundary = PropertyBoundary.objects.get()

    assert boundary.captured_by == verifier_user
    assert boundary.centroid_latitude is not None
    assert AuditEvent.objects.filter(
        action="geospatial.boundary_recorded",
        resource_id=str(boundary.id),
    ).exists()
    assert Notification.objects.filter(
        recipient_user=owner_user,
        notification_type=NotificationType.GEOSPATIAL,
    ).exists()


@pytest.mark.django_db
def test_owner_can_record_primary_location(
    api_client,
    owner_user,
    owner_property,
):
    api_client.force_authenticate(
        user=owner_user,
    )

    response = api_client.post(
        "/api/v1/property-locations/",
        {
            "property": str(owner_property.id),
            "latitude": "-6.8123456",
            "longitude": "39.2765432",
            "accuracy_meters": "5.00",
            "source_type": "USER_SUPPLIED",
            "is_primary": True,
        },
        format="json",
    )

    assert response.status_code == 201

    location = PropertyLocationRecord.objects.get()
    owner_property.refresh_from_db()

    assert location.is_primary is True
    assert owner_property.latitude == location.latitude
    assert owner_property.longitude == location.longitude


@pytest.mark.django_db
def test_invalid_boundary_coordinates_are_rejected(
    api_client,
    verifier_user,
    owner_property,
):
    api_client.force_authenticate(
        user=verifier_user,
    )

    response = api_client.post(
        "/api/v1/property-boundaries/",
        {
            "property": str(owner_property.id),
            "boundary_type": "PARCEL",
            "source_type": "OWERU_ESTABLISHED",
            "coordinates": [
                {
                    "latitude": -6.8000,
                    "longitude": 39.2500,
                },
                {
                    "latitude": 91.0000,
                    "longitude": 39.2600,
                },
            ],
        },
        format="json",
    )

    assert response.status_code == 400
    assert not PropertyBoundary.objects.exists()


@pytest.mark.django_db
def test_unrelated_party_cannot_view_geospatial_records(
    api_client,
    owner_user,
    requester_user,
    owner_property,
):
    location = PropertyLocationRecord.objects.create(
        property=owner_property,
        latitude="-6.8123456",
        longitude="39.2765432",
        source_type="USER_SUPPLIED",
        captured_by=owner_user,
        is_primary=True,
    )

    api_client.force_authenticate(
        user=requester_user,
    )

    response = api_client.get(
        f"/api/v1/property-locations/{location.id}/",
    )

    assert response.status_code == 404


@pytest.mark.django_db
def test_verifier_can_record_site_risk(
    api_client,
    verifier_user,
    owner_property,
):
    api_client.force_authenticate(
        user=verifier_user,
    )

    response = api_client.post(
        "/api/v1/site-risks/",
        {
            "property": str(owner_property.id),
            "risk_type": "ACCESS",
            "severity": "HIGH",
            "source_type": "OWERU_ESTABLISHED",
            "description": "Access road requires confirmation.",
            "mitigation_notes": "Request road reserve documents.",
        },
        format="json",
    )

    assert response.status_code == 201
    assert SiteRisk.objects.filter(
        property=owner_property,
        severity="HIGH",
    ).exists()
