from rest_framework import serializers
from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer,
)

from apps.authorization.services import AuthorizationService
from apps.parties.models import Party

from .models import AccountStatus, User
from .services import RegistrationService


class RegisterSerializer(serializers.Serializer):

    email = serializers.EmailField(
        required=False,
        allow_blank=False,
    )

    phone_number = serializers.CharField(
        required=False,
        max_length=30,
        allow_blank=False,
    )

    password = serializers.CharField(
        write_only=True,
        min_length=8,
    )

    display_name = serializers.CharField(
        max_length=255,
    )

    def validate(self, attrs):

        email = attrs.get("email")
        phone_number = attrs.get("phone_number")

        # At least one contact method is required
        if not email and not phone_number:
            raise serializers.ValidationError(
                "Either email or phone number is required."
            )

        # Normalize email
        if email:
            email = email.strip().lower()
            attrs["email"] = email

            # Check for duplicate email
            if User.objects.filter(email__iexact=email).exists():
                raise serializers.ValidationError({
                    "email": "A user with this email already exists."
                })

        # Normalize phone number
        if phone_number:
            phone_number = phone_number.strip()
            attrs["phone_number"] = phone_number

            # Check for duplicate phone number
            if User.objects.filter(phone_number=phone_number).exists():
                raise serializers.ValidationError({
                    "phone_number": "A user with this phone number already exists."
                })

        return attrs

    def create(self, validated_data):

        return RegistrationService.register(
            **validated_data
        )


class UserResponseSerializer(serializers.ModelSerializer):

    class Meta:
        model = User

        fields = [
            "id",
            "email",
            "phone_number",
            "status",
            "date_joined",
        ]

        read_only_fields = fields


class PartyResponseSerializer(serializers.ModelSerializer):

    class Meta:
        model = Party

        fields = [
            "id",
            "display_name",
            "party_type",
            "identity_status",
        ]

        read_only_fields = fields




class OweruTokenObtainPairSerializer(
    TokenObtainPairSerializer
):

    @classmethod
    def get_token(cls, user):

        if user.status != AccountStatus.ACTIVE:
            raise serializers.ValidationError(
                "This account is not active."
            )

        token = super().get_token(user)

        party = getattr(
            user,
            "party",
            None,
        )

        token["user_id"] = str(user.id)
        token["roles"] = AuthorizationService.role_codes(
            party=party,
        )
        token["permissions"] = AuthorizationService.permission_codes(
            party=party,
        )

        if party:

            token["party_id"] = str(
                party.id
            )

        return token
