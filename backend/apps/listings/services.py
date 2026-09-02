from django.db import transaction
from django.utils import timezone
from apps.authorization.exceptions import AuthorizationDenied
from apps.authorization.policies import ListingPolicy
from apps.audit.models import AuditCategory
from apps.audit.services import AuditService

from .models import (
    Listing,
    ListingParty,
    ListingPartyRelationship,
    ListingStatus,
)


class ListingService:

    @staticmethod
    @transaction.atomic
    def create_listing(
        *,
        party,
        property,
        validated_data,
    ):

        if not ListingPolicy.can_create(
            party=party,
            property=property,
        ):
            raise AuthorizationDenied()

        listing = Listing.objects.create(
            property=property,
            **validated_data,
        )

        ListingParty.objects.create(
            listing=listing,
            party=party,
            relationship=ListingPartyRelationship.OWNER,
            is_active=True,
        )

        AuditService.record(
            actor=party.user,
            category=AuditCategory.LISTING,
            action="listing.created",
            resource=listing,
            summary="Listing created.",
            after={
                "property_id": str(property.id),
                "status": listing.status,
                "price": str(listing.price),
                "currency": listing.currency,
            },
            metadata={
                "party_id": str(party.id),
            },
        )

        return listing


    @staticmethod
    @transaction.atomic
    def publish_listing(
        *,
        party,
        listing,
    ):

        if not ListingPolicy.can_manage(
            party=party,
            listing=listing,
        ):
            raise AuthorizationDenied()

        if listing.status != ListingStatus.DRAFT:
            raise ValueError(
                "Only draft listings can be published."
            )

        previous_status = listing.status

        listing.status = (
            ListingStatus.PUBLISHED
        )

        listing.published_at = timezone.now()

        listing.save(
            update_fields=[
                "status",
                "published_at",
                "updated_at",
            ]
        )

        AuditService.record(
            actor=party.user,
            category=AuditCategory.LISTING,
            action="listing.published",
            resource=listing,
            summary="Listing published.",
            before={
                "status": previous_status,
            },
            after={
                "status": listing.status,
                "published_at": listing.published_at.isoformat(),
            },
            metadata={
                "party_id": str(party.id),
            },
        )

        return listing


    @staticmethod
    @transaction.atomic
    def pause_listing(
        *,
        party,
        listing,
    ):

        if not ListingPolicy.can_manage(
            party=party,
            listing=listing,
        ):
            raise AuthorizationDenied()

        if listing.status != ListingStatus.PUBLISHED:
            raise ValueError(
                "Only published listings can be paused."
            )

        previous_status = listing.status

        listing.status = ListingStatus.PAUSED

        listing.save(
            update_fields=[
                "status",
                "updated_at",
            ]
        )

        AuditService.record(
            actor=party.user,
            category=AuditCategory.LISTING,
            action="listing.paused",
            resource=listing,
            summary="Listing paused.",
            before={
                "status": previous_status,
            },
            after={
                "status": listing.status,
            },
            metadata={
                "party_id": str(party.id),
            },
        )

        return listing



    @staticmethod
    @transaction.atomic
    def resume_listing(
        *,
        party,
        listing,
    ):

        if not ListingPolicy.can_manage(
            party=party,
            listing=listing,
        ):
            raise AuthorizationDenied()

        if listing.status != ListingStatus.PAUSED:
            raise ValueError(
                "Only paused listings can be resumed."
            )

        previous_status = listing.status

        listing.status = ListingStatus.PUBLISHED

        if listing.published_at is None:
            listing.published_at = timezone.now()

        listing.save(
            update_fields=[
                "status",
                "published_at",
                "updated_at",
            ]
        )

        AuditService.record(
            actor=party.user,
            category=AuditCategory.LISTING,
            action="listing.resumed",
            resource=listing,
            summary="Listing resumed.",
            before={
                "status": previous_status,
            },
            after={
                "status": listing.status,
                "published_at": listing.published_at.isoformat(),
            },
            metadata={
                "party_id": str(party.id),
            },
        )

        return listing




    @staticmethod
    @transaction.atomic
    def close_listing(
        *,
        party,
        listing,
    ):

        if not ListingPolicy.can_manage(
            party=party,
            listing=listing,
        ):
            raise AuthorizationDenied()

        if listing.status in [
            ListingStatus.CLOSED,
            ListingStatus.SOLD,
        ]:
            raise ValueError(
                "Listing is already closed."
            )

        previous_status = listing.status

        listing.status = ListingStatus.CLOSED

        listing.save(
            update_fields=[
                "status",
                "updated_at",
            ]
        )

        AuditService.record(
            actor=party.user,
            category=AuditCategory.LISTING,
            action="listing.closed",
            resource=listing,
            summary="Listing closed.",
            before={
                "status": previous_status,
            },
            after={
                "status": listing.status,
            },
            metadata={
                "party_id": str(party.id),
            },
        )

        return listing
