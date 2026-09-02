from rest_framework import serializers

from .models import Party, PartyRole, Role


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = [
            "id",
            "code",
            "name",
            "description",
            "is_active",
        ]


class PartyRoleSerializer(serializers.ModelSerializer):
    role = RoleSerializer(read_only=True)

    class Meta:
        model = PartyRole
        fields = [
            "id",
            "role",
            "is_active",
            "assigned_at",
            "expires_at",
        ]


class PartySerializer(serializers.ModelSerializer):
    """
    Full Party serializer.

    Use this internally or in endpoints where the caller
    is authorized to see the complete Party representation.
    """

    roles = PartyRoleSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = Party
        fields = [
            "id",
            "party_type",
            "display_name",
            "identity_status",
            "identity_verified_at",
            "tax_status",
            "tax_verified_at",
            "roles",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "identity_status",
            "identity_verified_at",
            "tax_verified_at",
            "created_at",
            "updated_at",
        ]


class PartyPublicSerializer(serializers.ModelSerializer):
    """
    Public representation of a Party.

    Sensitive identity and tax information is intentionally
    excluded.
    """

    class Meta:
        model = Party

        fields = [
            "id",
            "display_name",
            "party_type",
        ]

        read_only_fields = fields


class PartyPrivateSerializer(serializers.ModelSerializer):
    """
    Private representation of a Party.

    Intended for authenticated/authorized users who are
    allowed to see sensitive Party information.
    """

    roles = PartyRoleSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = Party

        fields = [
            "id",
            "display_name",
            "party_type",
            "identity_status",
            "identity_verified_at",
            "tax_status",
            "tax_verified_at",
            "roles",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "identity_status",
            "identity_verified_at",
            "tax_status",
            "tax_verified_at",
            "roles",
            "created_at",
            "updated_at",
        ]