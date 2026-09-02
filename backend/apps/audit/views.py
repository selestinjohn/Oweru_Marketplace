from rest_framework import viewsets
from rest_framework.permissions import BasePermission

from apps.authorization.services import AuthorizationService

from .models import AuditEvent
from .serializers import AuditEventSerializer


class IsAdminParty(BasePermission):

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

        return AuthorizationService.is_admin(
            party=party,
        )


class AuditEventViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [
        IsAdminParty,
    ]

    serializer_class = AuditEventSerializer

    queryset = AuditEvent.objects.select_related(
        "actor",
    )

    def get_queryset(self):
        queryset = super().get_queryset()

        filters = {}
        for field in [
            "category",
            "action",
            "resource_type",
            "resource_id",
            "actor",
        ]:
            value = self.request.query_params.get(
                field
            )
            if value:
                filters[field] = value

        return queryset.filter(
            **filters
        )
