from django.db import transaction
from django.utils import timezone

from apps.authorization.exceptions import AuthorizationDenied
from apps.audit.models import AuditCategory
from apps.audit.services import AuditService
from apps.properties.models import (
    Property,
    PropertyParty,
    PropertyPartyRole,
    SourceType,
)


class PropertyService:

    @staticmethod
    @transaction.atomic
    def create_property(
        *,
        party,
        validated_data,
    ):

        from apps.authorization.policies import PropertyPolicy

        if not PropertyPolicy.can_create(
            party=party,
        ):
            raise AuthorizationDenied()

        property = Property.objects.create(
            **validated_data,
        )

        PropertyParty.objects.create(
            property=property,
            party=party,
            relationship=PropertyPartyRole.OWNER,
            source_type=SourceType.USER_SUPPLIED,
            started_at=timezone.now(),
        )

        AuditService.record(
            actor=party.user,
            category=AuditCategory.PROPERTY,
            action="property.created",
            resource=property,
            summary="Property record created.",
            after={
                "reference_number": property.reference_number,
                "property_type": property.property_type,
                "status": property.status,
            },
            metadata={
                "party_id": str(party.id),
            },
        )

        return property
