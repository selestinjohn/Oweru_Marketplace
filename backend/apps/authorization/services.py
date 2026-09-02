from django.db.models import Q
from django.utils import timezone

from apps.parties.models import PartyRole


class AuthorizationService:

    @staticmethod
    def active_role_assignments(
        *,
        party,
    ):
        if not party:
            return PartyRole.objects.none()

        return party.roles.filter(
            is_active=True,
            role__is_active=True,
        ).filter(
            Q(expires_at__isnull=True)
            | Q(expires_at__gt=timezone.now())
        )

    @staticmethod
    def has_permission(
        *,
        party,
        permission_code,
    ):
        return AuthorizationService.active_role_assignments(
            party=party,
        ).filter(
            role__permissions__permission__code=permission_code,
        ).exists()

    @staticmethod
    def role_codes(
        *,
        party,
    ):
        return list(
            AuthorizationService.active_role_assignments(
                party=party,
            )
            .values_list(
                "role__code",
                flat=True,
            )
            .order_by(
                "role__code",
            )
        )

    @staticmethod
    def permission_codes(
        *,
        party,
    ):
        return list(
            AuthorizationService.active_role_assignments(
                party=party,
            )
            .filter(
                role__permissions__permission__isnull=False,
            )
            .values_list(
                "role__permissions__permission__code",
                flat=True,
            )
            .distinct()
            .order_by(
                "role__permissions__permission__code",
            )
        )

    @staticmethod
    def can_access_resource(
        *,
        party,
        permission_code,
        resource,
    ):
        if not AuthorizationService.has_permission(
            party=party,
            permission_code=permission_code,
        ):
            return False

        return True

    @staticmethod
    def is_admin(
        *,
        party,
    ):
        return AuthorizationService.active_role_assignments(
            party=party,
        ).filter(
            role__code="ADMIN",
        ).exists()
