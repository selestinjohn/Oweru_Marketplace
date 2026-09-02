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

from .models import DueDiligenceRequest
from .policies import DueDiligencePolicy
from .serializers import (
    DueDiligenceCancelSerializer,
    DueDiligenceDecisionSerializer,
    DueDiligenceRequestCreateSerializer,
    DueDiligenceRequestSerializer,
    DueDiligenceStartReviewSerializer,
    RiskReportSerializer,
    RiskReportSubmitSerializer,
)
from .services import DueDiligenceService


class DueDiligenceRequestViewSet(
    OptionalPaginationMixin,
    viewsets.GenericViewSet,
):
    permission_classes = [
        IsAuthenticated,
    ]

    serializer_class = DueDiligenceRequestSerializer
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_fields = [
        "property",
        "transaction",
        "requested_by_party",
        "assigned_reviewer",
        "status",
    ]
    search_fields = [
        "notes",
        "decision_notes",
        "property__reference_number",
    ]
    ordering_fields = [
        "created_at",
        "updated_at",
        "requested_at",
        "started_at",
        "submitted_at",
        "decided_at",
    ]
    ordering = [
        "-created_at",
    ]

    queryset = (
        DueDiligenceRequest.objects
        .select_related(
            "property",
            "transaction",
            "requested_by_party",
            "requested_by",
            "assigned_reviewer",
            "decided_by",
            "risk_report",
        )
        .prefetch_related(
            "findings",
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
            or DueDiligencePolicy.can_review(
                party=party,
            )
        ):
            return self.queryset

        return self.queryset.filter(
            Q(requested_by_party=party)
            | Q(transaction__buyer_party=party)
            | Q(transaction__seller_party=party)
            | Q(
                property__parties__party=party,
                property__parties__ended_at__isnull=True,
            )
        ).distinct()

    def create(self, request):
        serializer = DueDiligenceRequestCreateSerializer(
            data=request.data,
        )
        serializer.is_valid(
            raise_exception=True,
        )

        validated_data = dict(
            serializer.validated_data,
        )
        property_obj = validated_data.pop(
            "property"
        )
        transaction_obj = validated_data.pop(
            "transaction",
            None,
        )

        try:
            due_diligence_request = (
                DueDiligenceService.request_due_diligence(
                    party=request.user.party,
                    property_obj=property_obj,
                    transaction_obj=transaction_obj,
                    validated_data=validated_data,
                )
            )
        except AuthorizationDenied:
            raise PermissionDenied(
                "You are not authorized to request due diligence."
            )

        return Response(
            DueDiligenceRequestSerializer(due_diligence_request).data,
            status=status.HTTP_201_CREATED,
        )

    def list(self, request):
        return self.list_response(
            self.get_queryset(),
        )

    def retrieve(
        self,
        request,
        pk=None,
    ):
        due_diligence_request = self._get_request(pk)

        if not DueDiligencePolicy.can_view(
            party=request.user.party,
            request=due_diligence_request,
        ):
            raise PermissionDenied()

        return Response(
            DueDiligenceRequestSerializer(due_diligence_request).data,
        )

    @action(
        detail=True,
        methods=["post"],
        url_path="start-review",
    )
    def start_review(
        self,
        request,
        pk=None,
    ):
        return self._request_action(
            request=request,
            pk=pk,
            serializer_class=DueDiligenceStartReviewSerializer,
            service_method=DueDiligenceService.start_review,
        )

    @action(
        detail=True,
        methods=["post"],
        url_path="submit-report",
    )
    def submit_report(
        self,
        request,
        pk=None,
    ):
        serializer = RiskReportSubmitSerializer(
            data=request.data,
        )
        serializer.is_valid(
            raise_exception=True,
        )

        due_diligence_request = self._get_request(pk)

        try:
            report = DueDiligenceService.submit_report(
                party=request.user.party,
                request=due_diligence_request,
                validated_data=dict(serializer.validated_data),
            )
        except AuthorizationDenied:
            raise PermissionDenied(
                "You are not authorized to submit this risk report."
            )
        except ValueError as exc:
            return Response(
                {
                    "detail": str(exc),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            RiskReportSerializer(report).data,
            status=status.HTTP_201_CREATED,
        )

    @action(
        detail=True,
        methods=["post"],
        url_path="decide",
    )
    def decide(
        self,
        request,
        pk=None,
    ):
        return self._request_action(
            request=request,
            pk=pk,
            serializer_class=DueDiligenceDecisionSerializer,
            service_method=DueDiligenceService.decide,
        )

    @action(
        detail=True,
        methods=["post"],
        url_path="cancel",
    )
    def cancel(
        self,
        request,
        pk=None,
    ):
        return self._request_action(
            request=request,
            pk=pk,
            serializer_class=DueDiligenceCancelSerializer,
            service_method=DueDiligenceService.cancel,
        )

    def _request_action(
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

        due_diligence_request = self._get_request(pk)

        try:
            due_diligence_request = service_method(
                party=request.user.party,
                request=due_diligence_request,
                **serializer.validated_data,
            )
        except AuthorizationDenied:
            raise PermissionDenied(
                "You are not authorized to manage this due diligence request."
            )
        except ValueError as exc:
            return Response(
                {
                    "detail": str(exc),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            DueDiligenceRequestSerializer(due_diligence_request).data,
        )

    def _get_request(
        self,
        pk,
    ):
        return get_object_or_404(
            self.get_queryset(),
            pk=pk,
        )
