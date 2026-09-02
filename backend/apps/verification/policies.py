from apps.authorization.services import (
    AuthorizationService,
)
from apps.parties.constants import PermissionCode


class VerificationPolicy:

    @staticmethod
    def can_request(
        *,
        party,
        property,
    ):

        return AuthorizationService.has_permission(
            party=party,
            permission_code=PermissionCode.VERIFICATION_REQUEST,
        )

    @staticmethod
    def can_assign(
        *,
        party,
    ):

        return AuthorizationService.has_permission(
            party=party,
            permission_code=PermissionCode.VERIFICATION_ASSIGN,
        )

    @staticmethod
    def can_execute(
        *,
        party,
        verification,
    ):

        if verification.assigned_verifier_id != (
            party.user_id
        ):
            return False

        return AuthorizationService.has_permission(
            party=party,
            permission_code=PermissionCode.VERIFICATION_PERFORM,
        )

    @staticmethod
    def can_decide(
        *,
        party,
        verification,
    ):

        return AuthorizationService.has_permission(
            party=party,
            permission_code=PermissionCode.VERIFICATION_REVIEW,
        )
