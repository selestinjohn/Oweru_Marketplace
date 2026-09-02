from rest_framework.permissions import BasePermission

from apps.authorization.services import AuthorizationService


class HasPermission(BasePermission):

    required_permission = None

    def has_permission(
        self,
        request,
        view,
    ):

        if not request.user.is_authenticated:
            return False

        party = getattr(
            request.user,
            "party",
            None,
        )

        if not party:
            return False

        if not self.required_permission:
            return False

        return AuthorizationService.has_permission(
            party=party,
            permission_code=self.required_permission,
        )
