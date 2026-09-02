from django.db import transaction
from rest_framework_simplejwt.tokens import RefreshToken

from apps.authorization.services import AuthorizationService
from apps.parties.models import (
    Party,
    PartyRole,
    PartyType,
    Role,
)

from .models import User


class AuthContextService:

    @staticmethod
    def context_for_user(user):
        party = getattr(
            user,
            "party",
            None,
        )

        return {
            "user": {
                "id": str(user.id),
                "email": user.email,
                "phone_number": user.phone_number,
                "status": user.status,
                "date_joined": user.date_joined,
            },
            "party": AuthContextService._party_context(
                party=party,
            ),
            "roles": AuthorizationService.role_codes(
                party=party,
            ),
            "permissions": AuthorizationService.permission_codes(
                party=party,
            ),
        }

    @staticmethod
    def token_for_user(user):
        refresh = RefreshToken.for_user(user)
        context = AuthContextService.context_for_user(
            user,
        )

        refresh["user_id"] = str(user.id)
        refresh["roles"] = context["roles"]
        refresh["permissions"] = context["permissions"]

        if context["party"]:
            refresh["party_id"] = context["party"]["id"]

        return refresh

    @staticmethod
    def auth_response_payload(user):
        refresh = AuthContextService.token_for_user(
            user,
        )
        context = AuthContextService.context_for_user(
            user,
        )

        return {
            **context,
            "tokens": {
                "access": str(
                    refresh.access_token
                ),
                "refresh": str(refresh),
            },
        }

    @staticmethod
    def _party_context(
        *,
        party,
    ):
        if not party:
            return None

        return {
            "id": str(party.id),
            "display_name": party.display_name,
            "party_type": party.party_type,
            "identity_status": party.identity_status,
        }


class RegistrationService:

    @staticmethod
    @transaction.atomic
    def register(
        *,
        email=None,
        phone_number=None,
        password,
        display_name,
    ):
        user = User.objects.create_user(
            email=email,
            phone_number=phone_number,
            password=password,
        )

        party = Party.objects.create(
            user=user,
            party_type=PartyType.PERSON,
            display_name=display_name,
        )

        buyer_role, _ = Role.objects.get_or_create(
            code="BUYER",
            defaults={
                "name": "Customer / Buyer",
                "description": (
                    "Customer who can discover properties "
                    "and participate in marketplace activities."
                ),
            },
        )

        PartyRole.objects.create(
            party=party,
            role=buyer_role,
        )

        return user, party
