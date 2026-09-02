from rest_framework import serializers

from apps.listings.models import ListingPartyRelationship
from apps.parties.models import IdentityStatus

from .models import Listing


class ListingCreateSerializer(
    serializers.ModelSerializer,
):

    class Meta:
        model = Listing

        fields = [
            "property",
            "title",
            "description",
            "price",
            "currency",
        ]

        read_only_fields = [
            "status",
            "is_promoted",
            "published_at",
        ]


    def validate_price(self, value):

        if value <= 0:
            raise serializers.ValidationError(
                "Price must be greater than zero."
            )

        return value




class ListingSerializer(
    serializers.ModelSerializer,
):
    property_summary = serializers.SerializerMethodField()
    seller_summary = serializers.SerializerMethodField()
    trust_summary = serializers.SerializerMethodField()
    primary_image_url = serializers.SerializerMethodField()
    media = serializers.SerializerMethodField()

    class Meta:
        model = Listing

        fields = [
            "id",
            "property",
            "property_summary",
            "title",
            "description",
            "price",
            "currency",
            "status",
            "is_promoted",
            "seller_summary",
            "trust_summary",
            "primary_image_url",
            "media",
            "published_at",
            "created_at",
            "updated_at",
        ]

        read_only_fields = fields

    def get_property_summary(
        self,
        obj,
    ):
        property = obj.property
        project = property.project

        return {
            "id": property.id,
            "reference_number": property.reference_number,
            "property_type": property.property_type,
            "status": property.status,
            "ownership_basis": property.ownership_basis,
            "description": property.description,
            "location_description": property.location_description,
            "latitude": property.latitude,
            "longitude": property.longitude,
            "project": (
                {
                    "id": project.id,
                    "name": project.name,
                    "location_description": (
                        project.location_description
                    ),
                }
                if project
                else None
            ),
        }

    def get_seller_summary(
        self,
        obj,
    ):
        relationship = self._primary_listing_relationship(
            obj,
        )

        if not relationship:
            return None

        party = relationship.party

        return {
            "id": party.id,
            "display_name": party.display_name,
            "party_type": party.party_type,
            "relationship": relationship.relationship,
            "identity_status": party.identity_status,
            "is_identity_verified": (
                party.identity_status
                == IdentityStatus.VERIFIED
            ),
        }

    def get_trust_summary(
        self,
        obj,
    ):
        latest_verification = self._latest_verification(
            obj,
        )
        seller = self.get_seller_summary(
            obj,
        )

        return {
            "property_status": obj.property.status,
            "property_verification_status": (
                latest_verification.status
                if latest_verification
                else None
            ),
            "property_verified_at": (
                latest_verification.decided_at
                if latest_verification
                else None
            ),
            "seller_identity_status": (
                seller["identity_status"]
                if seller
                else None
            ),
            "is_promoted": obj.is_promoted,
        }

    def get_primary_image_url(
        self,
        obj,
    ):
        return None

    def get_media(
        self,
        obj,
    ):
        return []

    def _primary_listing_relationship(
        self,
        obj,
    ):
        active_relationships = [
            relationship
            for relationship in obj.parties.all()
            if relationship.is_active
            and relationship.ended_at is None
        ]

        for relationship in active_relationships:
            if (
                relationship.relationship
                == ListingPartyRelationship.AGENT
            ):
                return relationship

        return next(
            iter(active_relationships),
            None,
        )

    def _latest_verification(
        self,
        obj,
    ):
        verifications = list(
            obj.property.verifications.all()
        )

        return max(
            verifications,
            key=lambda verification: verification.created_at,
            default=None,
        )
