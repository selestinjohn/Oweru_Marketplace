from django.db.models import Count, Q, Sum
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, serializers, status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.authorization.exceptions import AuthorizationDenied
from apps.authorization.services import AuthorizationService
from apps.core.api import OptionalPaginationMixin
from apps.parties.constants import PermissionCode

from .models import Transaction, TransactionStatus
from .serializers import (
    ChecklistItemTransitionSerializer,
    TransactionSerializer,
    TransactionTimelineEntrySerializer,
    TransferChecklistItemSerializer,
)
from .services import TransactionService


class TransactionTransitionSerializer(serializers.Serializer):
    status = serializers.ChoiceField(
        choices=TransactionStatus.choices,
    )
    notes = serializers.CharField(
        required=False,
        allow_blank=True,
    )


class TransactionViewSet(
    OptionalPaginationMixin,
    viewsets.ReadOnlyModelViewSet,
):
    permission_classes = [
        IsAuthenticated,
    ]

    serializer_class = TransactionSerializer
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_fields = [
        "status",
        "buyer_party",
        "seller_party",
        "property",
        "listing",
        "currency",
    ]
    search_fields = [
        "property__reference_number",
        "listing__title",
    ]
    ordering_fields = [
        "created_at",
        "updated_at",
        "initiated_at",
        "completed_at",
        "agreed_amount",
    ]
    ordering = [
        "-created_at",
    ]

    queryset = (
        Transaction.objects
        .select_related(
            "offer",
            "listing",
            "property",
            "buyer_party",
            "seller_party",
            "initiated_by",
        )
        .prefetch_related(
            "checklist_items",
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

        if not AuthorizationService.has_permission(
            party=party,
            permission_code=PermissionCode.TRANSACTION_VIEW,
        ):
            return self.queryset.none()

        return self.queryset.filter(
            Q(buyer_party=party)
            | Q(seller_party=party)
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
        transaction = get_object_or_404(
            self.get_queryset(),
            pk=pk,
        )

        return Response(
            self.get_serializer(transaction).data,
        )

    @action(
        detail=True,
        methods=["get"],
        url_path="timeline",
    )
    def timeline(
        self,
        request,
        pk=None,
    ):
        transaction = get_object_or_404(
            self.get_queryset(),
            pk=pk,
        )

        entries = TransactionService.timeline(
            transaction_obj=transaction,
        )

        serializer = TransactionTimelineEntrySerializer(
            entries,
            many=True,
        )

        return Response(
            serializer.data,
        )

    @action(
        detail=True,
        methods=["post"],
        url_path="transition",
    )
    def transition(
        self,
        request,
        pk=None,
    ):
        serializer = TransactionTransitionSerializer(
            data=request.data,
        )
        serializer.is_valid(
            raise_exception=True,
        )

        transaction = get_object_or_404(
            self.get_queryset(),
            pk=pk,
        )

        try:
            transaction = TransactionService.transition(
                party=request.user.party,
                transaction_obj=transaction,
                new_status=serializer.validated_data["status"],
                notes=serializer.validated_data.get(
                    "notes",
                    "",
                ),
            )
        except AuthorizationDenied:
            raise PermissionDenied(
                "You are not authorized to manage this transaction."
            )
        except ValueError as exc:
            return Response(
                {
                    "detail": str(exc),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            self.get_serializer(transaction).data,
        )

    @action(
        detail=True,
        methods=["post"],
        url_path=(
            r"checklist-items/(?P<item_id>[^/.]+)/transition"
        ),
    )
    def transition_checklist_item(
        self,
        request,
        pk=None,
        item_id=None,
    ):
        serializer = ChecklistItemTransitionSerializer(
            data=request.data,
        )
        serializer.is_valid(
            raise_exception=True,
        )

        transaction = get_object_or_404(
            self.get_queryset(),
            pk=pk,
        )
        checklist_item = get_object_or_404(
            transaction.checklist_items.all(),
            pk=item_id,
        )

        try:
            checklist_item = (
                TransactionService.transition_checklist_item(
                    party=request.user.party,
                    transaction_obj=transaction,
                    checklist_item=checklist_item,
                    new_status=serializer.validated_data["status"],
                    notes=serializer.validated_data.get(
                        "notes",
                        "",
                    ),
                )
            )
        except AuthorizationDenied:
            raise PermissionDenied(
                "You are not authorized to manage this checklist item."
            )
        except ValueError as exc:
            return Response(
                {
                    "detail": str(exc),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            TransferChecklistItemSerializer(checklist_item).data,
        )


class TransactionOperationsDashboardView(APIView):
    permission_classes = [
        IsAuthenticated,
    ]

    def get(self, request):
        party = getattr(
            request.user,
            "party",
            None,
        )

        transactions = self._transactions_for_party(
            party=party,
        )

        return Response(
            {
                "scope": (
                    "ADMIN"
                    if AuthorizationService.is_admin(
                        party=party,
                    )
                    else "PARTY"
                ),
                "transactions": {
                    "total": transactions.count(),
                    "by_status": self._count_by_status(
                        transactions,
                    ),
                },
                "payments": self._payment_summary(
                    transactions=transactions,
                ),
                "disputes": self._status_summary(
                    self._disputes_for_party(
                        party=party,
                        transactions=transactions,
                    )
                ),
                "due_diligence": self._status_summary(
                    self._due_diligence_for_party(
                        party=party,
                        transactions=transactions,
                    )
                ),
                "notifications": self._notification_summary(
                    request=request,
                ),
            }
        )

    def _transactions_for_party(
        self,
        *,
        party,
    ):
        queryset = Transaction.objects.all()

        if AuthorizationService.is_admin(
            party=party,
        ):
            return queryset

        if not AuthorizationService.has_permission(
            party=party,
            permission_code=PermissionCode.TRANSACTION_VIEW,
        ):
            return queryset.none()

        return queryset.filter(
            Q(buyer_party=party)
            | Q(seller_party=party)
        )

    def _payment_summary(
        self,
        *,
        transactions,
    ):
        from apps.payments.models import Payment, PaymentStatus

        payments = Payment.objects.filter(
            transaction__in=transactions,
        )

        confirmed_total = payments.filter(
            status=PaymentStatus.CONFIRMED,
        ).aggregate(
            total=Sum("amount"),
        )["total"]

        return {
            "total": payments.count(),
            "by_status": self._count_by_status(
                payments,
            ),
            "confirmed_total": (
                str(confirmed_total)
                if confirmed_total is not None
                else "0.00"
            ),
        }

    def _disputes_for_party(
        self,
        *,
        party,
        transactions,
    ):
        from apps.disputes.models import Dispute
        from apps.disputes.policies import DisputePolicy

        queryset = Dispute.objects.all()
        if (
            AuthorizationService.is_admin(
                party=party,
            )
            or DisputePolicy.can_review(
                party=party,
            )
        ):
            return queryset

        return queryset.filter(
            Q(transaction__in=transactions)
            | Q(opened_by_party=party)
        )

    def _due_diligence_for_party(
        self,
        *,
        party,
        transactions,
    ):
        from apps.due_diligence.models import DueDiligenceRequest
        from apps.due_diligence.policies import DueDiligencePolicy

        queryset = DueDiligenceRequest.objects.all()
        if (
            AuthorizationService.is_admin(
                party=party,
            )
            or DueDiligencePolicy.can_review(
                party=party,
            )
        ):
            return queryset

        return queryset.filter(
            Q(transaction__in=transactions)
            | Q(requested_by_party=party)
        )

    def _notification_summary(
        self,
        *,
        request,
    ):
        from apps.notifications.models import Notification

        notifications = Notification.objects.filter(
            recipient_user=request.user,
            archived_at__isnull=True,
        )

        return {
            "unread": notifications.filter(
                read_at__isnull=True,
            ).count(),
            "total": notifications.count(),
        }

    def _status_summary(
        self,
        queryset,
    ):
        return {
            "total": queryset.count(),
            "by_status": self._count_by_status(
                queryset,
            ),
        }

    def _count_by_status(
        self,
        queryset,
    ):
        return {
            row["status"]: row["count"]
            for row in queryset.values("status").annotate(
                count=Count("id"),
            )
        }
