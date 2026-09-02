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

from .models import Payment
from .policies import PaymentPolicy
from .serializers import (
    PaymentActionSerializer,
    PaymentCreateSerializer,
    PaymentSerializer,
)
from .services import PaymentService


class PaymentViewSet(
    OptionalPaginationMixin,
    viewsets.GenericViewSet,
):
    permission_classes = [
        IsAuthenticated,
    ]

    serializer_class = PaymentSerializer
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_fields = [
        "transaction",
        "payer_party",
        "payee_party",
        "purpose",
        "method",
        "status",
        "currency",
    ]
    search_fields = [
        "external_reference",
        "notes",
        "transaction__property__reference_number",
    ]
    ordering_fields = [
        "created_at",
        "updated_at",
        "amount",
        "confirmed_at",
    ]
    ordering = [
        "-created_at",
    ]

    queryset = (
        Payment.objects
        .select_related(
            "transaction",
            "payer_party",
            "payee_party",
            "initiated_by",
            "confirmed_by",
        )
        .prefetch_related(
            "receipt",
        )
    )

    def get_queryset(self):
        party = getattr(
            self.request.user,
            "party",
            None,
        )

        if AuthorizationService.is_admin(
            party=party,
        ):
            return self.queryset

        return self.queryset.filter(
            Q(transaction__buyer_party=party)
            | Q(transaction__seller_party=party)
            | Q(payer_party=party)
            | Q(payee_party=party)
        ).distinct()

    def create(self, request):
        serializer = PaymentCreateSerializer(
            data=request.data,
        )
        serializer.is_valid(
            raise_exception=True,
        )

        validated_data = dict(
            serializer.validated_data,
        )
        transaction_obj = validated_data.pop(
            "transaction"
        )

        try:
            payment = PaymentService.create_payment(
                party=request.user.party,
                transaction_obj=transaction_obj,
                validated_data=validated_data,
            )
        except AuthorizationDenied:
            raise PermissionDenied(
                "You are not authorized to create this payment record."
            )

        return Response(
            PaymentSerializer(payment).data,
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
        payment = get_object_or_404(
            self.get_queryset(),
            pk=pk,
        )

        if not PaymentPolicy.can_view(
            party=request.user.party,
            payment=payment,
        ):
            raise PermissionDenied()

        return Response(
            PaymentSerializer(payment).data,
        )

    @action(
        detail=True,
        methods=["post"],
        url_path="confirm",
    )
    def confirm(
        self,
        request,
        pk=None,
    ):
        return self._payment_action(
            request=request,
            pk=pk,
            service_method=PaymentService.confirm_payment,
        )

    @action(
        detail=True,
        methods=["post"],
        url_path="fail",
    )
    def fail(
        self,
        request,
        pk=None,
    ):
        return self._payment_action(
            request=request,
            pk=pk,
            service_method=PaymentService.fail_payment,
        )

    @action(
        detail=True,
        methods=["post"],
        url_path="refund",
    )
    def refund(
        self,
        request,
        pk=None,
    ):
        return self._payment_action(
            request=request,
            pk=pk,
            service_method=PaymentService.refund_payment,
        )

    def _payment_action(
        self,
        *,
        request,
        pk,
        service_method,
    ):
        serializer = PaymentActionSerializer(
            data=request.data,
        )
        serializer.is_valid(
            raise_exception=True,
        )

        payment = get_object_or_404(
            self.get_queryset(),
            pk=pk,
        )

        try:
            payment = service_method(
                party=request.user.party,
                payment=payment,
                **serializer.validated_data,
            )
        except AuthorizationDenied:
            raise PermissionDenied(
                "You are not authorized to manage this payment."
            )
        except ValueError as exc:
            return Response(
                {
                    "detail": str(exc),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            PaymentSerializer(payment).data,
        )
