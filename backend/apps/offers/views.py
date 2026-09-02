from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.authorization.exceptions import AuthorizationDenied
from apps.authorization.services import AuthorizationService

from .models import Offer
from .serializers import (
    OfferCounterSerializer,
    OfferCreateSerializer,
    OfferMessageSerializer,
    OfferSerializer,
)
from .services import OfferService


class OfferViewSet(viewsets.GenericViewSet):
    permission_classes = [
        IsAuthenticated,
    ]

    serializer_class = OfferSerializer

    queryset = (
        Offer.objects
        .select_related(
            "listing",
            "listing__property",
            "buyer_party",
            "created_by",
            "responded_by",
        )
        .prefetch_related(
            "events",
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
            Q(buyer_party=party)
            | Q(
                listing__parties__party=party,
                listing__parties__is_active=True,
            )
        ).distinct()

    def create(self, request):
        serializer = OfferCreateSerializer(
            data=request.data,
        )
        serializer.is_valid(
            raise_exception=True,
        )

        validated_data = dict(
            serializer.validated_data,
        )
        listing = validated_data.pop(
            "listing"
        )

        try:
            offer = OfferService.create_offer(
                party=request.user.party,
                listing=listing,
                validated_data=validated_data,
            )
        except AuthorizationDenied:
            raise PermissionDenied(
                "You are not authorized to create this offer."
            )

        return Response(
            OfferSerializer(offer).data,
            status=status.HTTP_201_CREATED,
        )

    def list(self, request):
        serializer = OfferSerializer(
            self.get_queryset(),
            many=True,
        )

        return Response(
            serializer.data,
        )

    def retrieve(
        self,
        request,
        pk=None,
    ):
        offer = get_object_or_404(
            self.get_queryset(),
            pk=pk,
        )

        return Response(
            OfferSerializer(offer).data,
        )

    @action(
        detail=True,
        methods=["post"],
        url_path="accept",
    )
    def accept(
        self,
        request,
        pk=None,
    ):
        serializer = OfferMessageSerializer(
            data=request.data,
        )
        serializer.is_valid(
            raise_exception=True,
        )

        return self._respond(
            request=request,
            pk=pk,
            service_method=OfferService.accept_offer,
            validated_data=serializer.validated_data,
        )

    @action(
        detail=True,
        methods=["post"],
        url_path="reject",
    )
    def reject(
        self,
        request,
        pk=None,
    ):
        serializer = OfferMessageSerializer(
            data=request.data,
        )
        serializer.is_valid(
            raise_exception=True,
        )

        return self._respond(
            request=request,
            pk=pk,
            service_method=OfferService.reject_offer,
            validated_data=serializer.validated_data,
        )

    @action(
        detail=True,
        methods=["post"],
        url_path="counter",
    )
    def counter(
        self,
        request,
        pk=None,
    ):
        serializer = OfferCounterSerializer(
            data=request.data,
        )
        serializer.is_valid(
            raise_exception=True,
        )

        return self._respond(
            request=request,
            pk=pk,
            service_method=OfferService.counter_offer,
            validated_data=serializer.validated_data,
        )

    @action(
        detail=True,
        methods=["post"],
        url_path="withdraw",
    )
    def withdraw(
        self,
        request,
        pk=None,
    ):
        serializer = OfferMessageSerializer(
            data=request.data,
        )
        serializer.is_valid(
            raise_exception=True,
        )

        offer = get_object_or_404(
            self.get_queryset(),
            pk=pk,
        )

        try:
            offer = OfferService.withdraw_offer(
                party=request.user.party,
                offer=offer,
                **serializer.validated_data,
            )
        except AuthorizationDenied:
            raise PermissionDenied(
                "You are not authorized to withdraw this offer."
            )
        except ValueError as exc:
            return Response(
                {
                    "detail": str(exc),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            OfferSerializer(offer).data,
        )

    def _respond(
        self,
        *,
        request,
        pk,
        service_method,
        validated_data,
    ):
        offer = get_object_or_404(
            self.get_queryset(),
            pk=pk,
        )

        try:
            offer = service_method(
                party=request.user.party,
                offer=offer,
                **validated_data,
            )
        except AuthorizationDenied:
            raise PermissionDenied(
                "You are not authorized to respond to this offer."
            )
        except ValueError as exc:
            return Response(
                {
                    "detail": str(exc),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            OfferSerializer(offer).data,
        )
