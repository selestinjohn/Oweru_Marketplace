from decimal import Decimal

from django.db import transaction

from apps.audit.models import AuditCategory
from apps.audit.services import AuditService
from apps.authorization.exceptions import AuthorizationDenied
from apps.properties.models import PropertyParty, PropertyPartyRole

from .models import (
    BoundaryType,
    PropertyBoundary,
    PropertyLocationRecord,
    SiteRisk,
)
from .policies import GeospatialPolicy


class GeospatialService:

    @staticmethod
    @transaction.atomic
    def record_location(
        *,
        party,
        property_obj,
        validated_data,
    ):
        if not GeospatialPolicy.can_record(
            party=party,
            property=property_obj,
        ):
            raise AuthorizationDenied()

        is_primary = validated_data.get(
            "is_primary",
            False,
        )

        if is_primary:
            PropertyLocationRecord.objects.filter(
                property=property_obj,
                is_primary=True,
            ).update(
                is_primary=False,
            )

        location = PropertyLocationRecord.objects.create(
            property=property_obj,
            captured_by=party.user,
            **validated_data,
        )

        if location.is_primary:
            property_obj.latitude = location.latitude
            property_obj.longitude = location.longitude
            property_obj.save(
                update_fields=[
                    "latitude",
                    "longitude",
                    "updated_at",
                ]
            )

        AuditService.record(
            actor=party.user,
            category=AuditCategory.GEOSPATIAL,
            action="geospatial.location_recorded",
            resource=location,
            summary="Property location recorded.",
            after={
                "property_id": str(property_obj.id),
                "latitude": str(location.latitude),
                "longitude": str(location.longitude),
                "is_primary": location.is_primary,
            },
        )

        GeospatialService._notify_property_owners(
            actor_party=party,
            property_obj=property_obj,
            resource=location,
            title="Property location updated",
            message="A location record was added to your property.",
        )

        return location

    @staticmethod
    @transaction.atomic
    def record_boundary(
        *,
        party,
        property_obj,
        validated_data,
    ):
        if not GeospatialPolicy.can_record(
            party=party,
            property=property_obj,
        ):
            raise AuthorizationDenied()

        coordinates = validated_data["coordinates"]
        centroid = GeospatialService._calculate_centroid(
            coordinates,
        )
        boundary_type = validated_data.get(
            "boundary_type",
            BoundaryType.PARCEL,
        )

        if validated_data.get(
            "is_current",
            True,
        ):
            PropertyBoundary.objects.filter(
                property=property_obj,
                boundary_type=boundary_type,
                is_current=True,
            ).update(
                is_current=False,
            )

        boundary = PropertyBoundary.objects.create(
            property=property_obj,
            captured_by=party.user,
            centroid_latitude=centroid["latitude"],
            centroid_longitude=centroid["longitude"],
            **validated_data,
        )

        AuditService.record(
            actor=party.user,
            category=AuditCategory.GEOSPATIAL,
            action="geospatial.boundary_recorded",
            resource=boundary,
            summary="Property boundary recorded.",
            after={
                "property_id": str(property_obj.id),
                "boundary_type": boundary.boundary_type,
                "points": len(boundary.coordinates),
                "is_current": boundary.is_current,
            },
        )

        GeospatialService._notify_property_owners(
            actor_party=party,
            property_obj=property_obj,
            resource=boundary,
            title="Property boundary updated",
            message="A boundary record was added to your property.",
        )

        return boundary

    @staticmethod
    @transaction.atomic
    def record_site_risk(
        *,
        party,
        property_obj,
        validated_data,
    ):
        if not GeospatialPolicy.can_record(
            party=party,
            property=property_obj,
        ):
            raise AuthorizationDenied()

        site_risk = SiteRisk.objects.create(
            property=property_obj,
            recorded_by=party.user,
            **validated_data,
        )

        AuditService.record(
            actor=party.user,
            category=AuditCategory.GEOSPATIAL,
            action="geospatial.site_risk_recorded",
            resource=site_risk,
            summary="Property site risk recorded.",
            after={
                "property_id": str(property_obj.id),
                "risk_type": site_risk.risk_type,
                "severity": site_risk.severity,
            },
        )

        GeospatialService._notify_property_owners(
            actor_party=party,
            property_obj=property_obj,
            resource=site_risk,
            title="Property site risk recorded",
            message="A site risk was recorded for your property.",
        )

        return site_risk

    @staticmethod
    def _calculate_centroid(coordinates):
        latitude_sum = sum(
            Decimal(str(point["latitude"]))
            for point in coordinates
        )
        longitude_sum = sum(
            Decimal(str(point["longitude"]))
            for point in coordinates
        )
        point_count = Decimal(
            len(coordinates)
        )

        return {
            "latitude": latitude_sum / point_count,
            "longitude": longitude_sum / point_count,
        }

    @staticmethod
    def _notify_property_owners(
        *,
        actor_party,
        property_obj,
        resource,
        title,
        message,
    ):
        from apps.notifications.models import NotificationType
        from apps.notifications.services import NotificationService

        owner_relationships = (
            PropertyParty.objects
            .filter(
                property=property_obj,
                relationship=PropertyPartyRole.OWNER,
                ended_at__isnull=True,
            )
            .select_related(
                "party",
                "party__user",
            )
        )

        for relationship in owner_relationships:
            if relationship.party_id == actor_party.id:
                continue

            NotificationService.notify_party(
                party=relationship.party,
                title=title,
                message=message,
                notification_type=NotificationType.GEOSPATIAL,
                resource=resource,
                payload={
                    "property_id": str(property_obj.id),
                },
                actor=actor_party.user,
            )
