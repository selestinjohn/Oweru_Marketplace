from decimal import Decimal, InvalidOperation

from django.db.models import Q
from rest_framework import (
    status,
    viewsets,
)
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import (
    AllowAny,
    IsAuthenticated,
)
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from apps.core.api import OptionalPaginationMixin

from .models import Listing
from .querysets import ListingQuerySet
from .serializers import (
    ListingCreateSerializer,
    ListingSerializer,
)
from .services import ListingService


class ListingViewSet(
    OptionalPaginationMixin,
    viewsets.GenericViewSet,
):
    serializer_class = ListingSerializer
    ordering_fields = [
        "created_at",
        "updated_at",
        "published_at",
        "price",
        "title",
    ]

    def get_permissions(self):

        if self.action in [
            "list",
            "retrieve",
        ]:
            return [
                AllowAny(),
            ]

        return [
            IsAuthenticated(),
        ]

    def create(self, request):

        serializer = ListingCreateSerializer(
            data=request.data,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        party = request.user.party

        validated_data = dict(
            serializer.validated_data,
        )

        property = validated_data.pop("property")

        listing = ListingService.create_listing(
            party=party,
            property=property,
            validated_data=validated_data,
        )

        return Response(
            ListingSerializer(listing).data,
            status=status.HTTP_201_CREATED,
        )

    def list(self, request):

        listings = self._filter_public_queryset(
            ListingQuerySet.public(),
        )

        return self.list_response(
            listings,
        )

    def retrieve(self, request, pk=None):

        listing = get_object_or_404(
            ListingQuerySet.public(),
            pk=pk,
        )

        return Response(
            ListingSerializer(listing).data,
        )

    @action(
        detail=False,
        methods=["get"],
        url_path="mine",
    )
    def mine(self, request):

        party = request.user.party

        listings = ListingQuerySet.for_party(
            party=party,
        )

        return self.list_response(
            listings,
        )

    def _filter_public_queryset(
        self,
        queryset,
    ):
        query_params = self.request.query_params
        search = query_params.get(
            "search",
        )
        property_type = query_params.get(
            "property_type",
        )
        location = query_params.get(
            "location",
        )
        project = query_params.get(
            "project",
        )
        min_price = query_params.get(
            "min_price",
        )
        max_price = query_params.get(
            "max_price",
        )
        promoted = query_params.get(
            "promoted",
        )
        has_coordinates = query_params.get(
            "has_coordinates",
        )

        if search:
            queryset = queryset.filter(
                Q(title__icontains=search)
                | Q(description__icontains=search)
                | Q(
                    property__reference_number__icontains=search
                )
                | Q(
                    property__location_description__icontains=search
                )
            )

        if property_type:
            property_types = [
                item.strip().upper()
                for item in property_type.split(",")
                if item.strip()
            ]
            queryset = queryset.filter(
                property__property_type__in=property_types,
            )

        if location:
            queryset = queryset.filter(
                property__location_description__icontains=location,
            )

        if project:
            queryset = queryset.filter(
                property__project=project,
            )

        if min_price:
            queryset = queryset.filter(
                price__gte=self._decimal_query_param(
                    "min_price",
                    min_price,
                )
            )

        if max_price:
            queryset = queryset.filter(
                price__lte=self._decimal_query_param(
                    "max_price",
                    max_price,
                )
            )

        promoted_value = self._optional_boolean_query_param(
            "promoted",
            promoted,
        )
        if promoted_value is not None:
            queryset = queryset.filter(
                is_promoted=promoted_value,
            )

        coordinates_value = self._optional_boolean_query_param(
            "has_coordinates",
            has_coordinates,
        )
        if coordinates_value is not None:
            if coordinates_value:
                queryset = queryset.filter(
                    property__latitude__isnull=False,
                    property__longitude__isnull=False,
                )
            else:
                queryset = queryset.filter(
                    Q(property__latitude__isnull=True)
                    | Q(property__longitude__isnull=True)
                )

        return queryset.order_by(
            self._ordering_query_param(),
        )

    def _decimal_query_param(
        self,
        name,
        value,
    ):
        try:
            return Decimal(
                value,
            )
        except InvalidOperation:
            raise ValidationError(
                {
                    name: "Must be a valid decimal number.",
                }
            )

    def _optional_boolean_query_param(
        self,
        name,
        value,
    ):
        if value is None:
            return None

        normalized_value = value.lower()
        if normalized_value in [
            "true",
            "1",
            "yes",
        ]:
            return True

        if normalized_value in [
            "false",
            "0",
            "no",
        ]:
            return False

        raise ValidationError(
            {
                name: (
                    "Must be one of true, false, "
                    "1, 0, yes, or no."
                ),
            }
        )

    def _ordering_query_param(
        self,
    ):
        ordering = self.request.query_params.get(
            "ordering",
            "-published_at",
        )
        field_name = ordering.removeprefix(
            "-",
        )

        if field_name not in self.ordering_fields:
            raise ValidationError(
                {
                    "ordering": (
                        "Unsupported ordering field."
                    ),
                }
            )

        return ordering

    def _transition(self, request, pk, service_method):

        listing = get_object_or_404(
            Listing,
            pk=pk,
        )

        try:
            listing = service_method(
                party=request.user.party,
                listing=listing,
            )
        except ValueError as exc:
            return Response(
                {"detail": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            ListingSerializer(listing).data,
        )

    @action(
        detail=True,
        methods=["post"],
        url_path="publish",
    )
    def publish(self, request, pk=None):

        return self._transition(
            request,
            pk,
            ListingService.publish_listing,
        )

    @action(
        detail=True,
        methods=["post"],
        url_path="pause",
    )
    def pause(self, request, pk=None):

        return self._transition(
            request,
            pk,
            ListingService.pause_listing,
        )

    @action(
        detail=True,
        methods=["post"],
        url_path="resume",
    )
    def resume(self, request, pk=None):

        return self._transition(
            request,
            pk,
            ListingService.resume_listing,
        )

    @action(
        detail=True,
        methods=["post"],
        url_path="close",
    )
    def close(self, request, pk=None):

        return self._transition(
            request,
            pk,
            ListingService.close_listing,
        )
