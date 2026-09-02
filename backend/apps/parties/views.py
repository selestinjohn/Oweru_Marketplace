from rest_framework import viewsets
from rest_framework.permissions import BasePermission

from .models import Party
from .serializers import (
    PartyPrivateSerializer,
)


class IsAuthenticatedParty(BasePermission):

    def has_permission(
        self,
        request,
        view,
    ):
        return bool(
            request.user
            and request.user.is_authenticated
            and getattr(
                request.user,
                "party",
                None,
            )
        )


class PartyViewSet(
    viewsets.ReadOnlyModelViewSet
):

    permission_classes = [
        IsAuthenticatedParty,
    ]

    queryset = Party.objects.prefetch_related(
        "roles__role",
    )

    serializer_class = PartyPrivateSerializer