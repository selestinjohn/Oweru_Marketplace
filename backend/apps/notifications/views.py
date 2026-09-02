from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.authorization.exceptions import AuthorizationDenied
from apps.core.api import OptionalPaginationMixin

from .models import Notification
from .policies import NotificationPolicy
from .serializers import NotificationSerializer
from .services import NotificationService


class NotificationViewSet(
    OptionalPaginationMixin,
    viewsets.GenericViewSet,
):
    permission_classes = [
        IsAuthenticated,
    ]

    serializer_class = NotificationSerializer
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_fields = [
        "notification_type",
        "resource_type",
        "resource_id",
    ]
    search_fields = [
        "title",
        "message",
        "resource_type",
        "resource_id",
    ]
    ordering_fields = [
        "created_at",
        "updated_at",
        "read_at",
        "archived_at",
    ]
    ordering = [
        "-created_at",
    ]

    queryset = (
        Notification.objects
        .select_related(
            "recipient_user",
            "recipient_party",
        )
    )

    def get_queryset(self):
        party = getattr(
            self.request.user,
            "party",
            None,
        )

        queryset = self.queryset.filter(
            recipient_user=self.request.user,
        )

        if self.request.query_params.get("include_archived") != "true":
            queryset = queryset.filter(
                archived_at__isnull=True,
            )

        if self.request.query_params.get("unread") == "true":
            queryset = queryset.filter(
                read_at__isnull=True,
            )

        if not party:
            return queryset.none()

        return queryset

    def list(self, request):
        return self.list_response(
            self.get_queryset(),
        )

    def retrieve(
        self,
        request,
        pk=None,
    ):
        notification = self._get_notification(pk)

        if not NotificationPolicy.can_view(
            party=request.user.party,
            notification=notification,
        ):
            raise PermissionDenied()

        return Response(
            NotificationSerializer(notification).data,
        )

    @action(
        detail=True,
        methods=["post"],
        url_path="mark-read",
    )
    def mark_read(
        self,
        request,
        pk=None,
    ):
        notification = self._get_notification(pk)

        try:
            notification = NotificationService.mark_read(
                party=request.user.party,
                notification=notification,
            )
        except AuthorizationDenied:
            raise PermissionDenied(
                "You are not authorized to manage this notification."
            )

        return Response(
            NotificationSerializer(notification).data,
        )

    @action(
        detail=False,
        methods=["post"],
        url_path="mark-all-read",
    )
    def mark_all_read(self, request):
        try:
            count = NotificationService.mark_all_read(
                party=request.user.party,
            )
        except AuthorizationDenied:
            raise PermissionDenied(
                "You are not authorized to manage notifications."
            )

        return Response(
            {
                "updated": count,
            }
        )

    @action(
        detail=True,
        methods=["post"],
        url_path="archive",
    )
    def archive(
        self,
        request,
        pk=None,
    ):
        notification = self._get_notification(pk)

        try:
            notification = NotificationService.archive(
                party=request.user.party,
                notification=notification,
            )
        except AuthorizationDenied:
            raise PermissionDenied(
                "You are not authorized to manage this notification."
            )

        return Response(
            NotificationSerializer(notification).data,
        )

    def _get_notification(
        self,
        pk,
    ):
        return get_object_or_404(
            self.get_queryset(),
            pk=pk,
        )
