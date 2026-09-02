from django.db.models import Q
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.authorization.exceptions import AuthorizationDenied
from apps.authorization.services import AuthorizationService
from apps.core.api import OptionalPaginationMixin

from .models import Dispute
from .policies import DisputePolicy
from .serializers import (
    DisputeCloseSerializer,
    DisputeCreateSerializer,
    DisputeEvidenceCreateSerializer,
    DisputeEvidenceSerializer,
    DisputeMessageCreateSerializer,
    DisputeMessageSerializer,
    DisputeResolveSerializer,
    DisputeReviewSerializer,
    DisputeSerializer,
)
from .services import DisputeService


class DisputeViewSet(
    OptionalPaginationMixin,
    viewsets.GenericViewSet,
):
    permission_classes = [
        IsAuthenticated,
    ]

    serializer_class = DisputeSerializer
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_fields = [
        "transaction",
        "payment",
        "listing",
        "property",
        "opened_by_party",
        "assigned_to",
        "category",
        "priority",
        "status",
    ]
    search_fields = [
        "subject",
        "description",
        "resolution_summary",
        "property__reference_number",
        "listing__title",
    ]
    ordering_fields = [
        "created_at",
        "updated_at",
        "resolved_at",
        "closed_at",
        "priority",
    ]
    ordering = [
        "-created_at",
    ]

    queryset = (
        Dispute.objects
        .select_related(
            "transaction",
            "payment",
            "listing",
            "property",
            "opened_by_party",
            "opened_by",
            "assigned_to",
            "resolved_by",
        )
        .prefetch_related(
            "messages",
            "evidence_items",
        )
    )

    def get_queryset(self):
        party = getattr(
            self.request.user,
            "party",
            None,
        )

        if (
            AuthorizationService.is_admin(
                party=party,
            )
            or DisputePolicy.can_review(
                party=party,
            )
        ):
            return self.queryset

        return self.queryset.filter(
            Q(opened_by_party=party)
            | Q(transaction__buyer_party=party)
            | Q(transaction__seller_party=party)
            | Q(payment__payer_party=party)
            | Q(payment__payee_party=party)
            | Q(
                listing__parties__party=party,
                listing__parties__is_active=True,
            )
            | Q(
                property__parties__party=party,
                property__parties__ended_at__isnull=True,
            )
        ).distinct()

    def create(self, request):
        serializer = DisputeCreateSerializer(
            data=request.data,
        )
        serializer.is_valid(
            raise_exception=True,
        )

        try:
            dispute = DisputeService.open_dispute(
                party=request.user.party,
                validated_data=serializer.validated_data,
            )
        except AuthorizationDenied:
            raise PermissionDenied(
                "You are not authorized to open this dispute."
            )
        except ValueError as exc:
            return Response(
                {
                    "detail": str(exc),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            DisputeSerializer(
                dispute,
                context={
                    "request": request,
                },
            ).data,
            status=status.HTTP_201_CREATED,
        )

    def list(self, request):
        return self.list_response(
            self.get_queryset(),
            context={
                "request": request,
            },
        )

    def retrieve(
        self,
        request,
        pk=None,
    ):
        dispute = get_object_or_404(
            self.get_queryset(),
            pk=pk,
        )

        if not DisputePolicy.can_view(
            party=request.user.party,
            dispute=dispute,
        ):
            raise PermissionDenied()

        return Response(
            DisputeSerializer(
                dispute,
                context={
                    "request": request,
                },
            ).data,
        )

    @action(
        detail=True,
        methods=["post"],
        url_path="review",
    )
    def review(
        self,
        request,
        pk=None,
    ):
        return self._dispute_action(
            request=request,
            pk=pk,
            serializer_class=DisputeReviewSerializer,
            service_method=DisputeService.start_review,
        )

    @action(
        detail=True,
        methods=["post"],
        url_path="resolve",
    )
    def resolve(
        self,
        request,
        pk=None,
    ):
        return self._dispute_action(
            request=request,
            pk=pk,
            serializer_class=DisputeResolveSerializer,
            service_method=DisputeService.resolve_dispute,
        )

    @action(
        detail=True,
        methods=["post"],
        url_path="close",
    )
    def close(
        self,
        request,
        pk=None,
    ):
        return self._dispute_action(
            request=request,
            pk=pk,
            serializer_class=DisputeCloseSerializer,
            service_method=DisputeService.close_dispute,
        )

    @action(
        detail=True,
        methods=["post"],
        url_path="messages",
    )
    def add_message(
        self,
        request,
        pk=None,
    ):
        serializer = DisputeMessageCreateSerializer(
            data=request.data,
        )
        serializer.is_valid(
            raise_exception=True,
        )

        dispute = self._get_dispute(pk)

        try:
            message = DisputeService.add_message(
                party=request.user.party,
                dispute=dispute,
                **serializer.validated_data,
            )
        except AuthorizationDenied:
            raise PermissionDenied(
                "You are not authorized to comment on this dispute."
            )

        return Response(
            DisputeMessageSerializer(message).data,
            status=status.HTTP_201_CREATED,
        )

    @action(
        detail=True,
        methods=["post"],
        url_path="evidence",
    )
    def add_evidence(
        self,
        request,
        pk=None,
    ):
        serializer = DisputeEvidenceCreateSerializer(
            data=request.data,
        )
        serializer.is_valid(
            raise_exception=True,
        )

        dispute = self._get_dispute(pk)

        try:
            evidence_item = DisputeService.add_evidence(
                party=request.user.party,
                dispute=dispute,
                validated_data=serializer.validated_data,
            )
        except AuthorizationDenied:
            raise PermissionDenied(
                "You are not authorized to add evidence to this dispute."
            )

        return Response(
            DisputeEvidenceSerializer(evidence_item).data,
            status=status.HTTP_201_CREATED,
        )

    def _dispute_action(
        self,
        *,
        request,
        pk,
        serializer_class,
        service_method,
    ):
        serializer = serializer_class(
            data=request.data,
        )
        serializer.is_valid(
            raise_exception=True,
        )

        dispute = self._get_dispute(pk)

        try:
            dispute = service_method(
                party=request.user.party,
                dispute=dispute,
                **serializer.validated_data,
            )
        except AuthorizationDenied:
            raise PermissionDenied(
                "You are not authorized to manage this dispute."
            )
        except ValueError as exc:
            return Response(
                {
                    "detail": str(exc),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            DisputeSerializer(
                dispute,
                context={
                    "request": request,
                },
            ).data,
        )

    def _get_dispute(
        self,
        pk,
    ):
        return get_object_or_404(
            self.get_queryset(),
            pk=pk,
        )
