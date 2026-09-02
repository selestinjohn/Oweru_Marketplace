from django.db.models import Q
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from rest_framework import status, viewsets
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.authorization.exceptions import AuthorizationDenied
from apps.authorization.services import AuthorizationService
from apps.core.api import OptionalPaginationMixin
from apps.parties.constants import PermissionCode
from apps.properties.models import Property

from .models import (
    PropertyBoundary,
    PropertyLocationRecord,
    SiteRisk,
)
from .policies import GeospatialPolicy
from .serializers import (
    PropertyBoundarySerializer,
    PropertyLocationRecordSerializer,
    SiteRiskSerializer,
)
from .services import GeospatialService


class GeospatialQuerysetMixin(OptionalPaginationMixin):

    def _property_filter(self):
        party = getattr(
            self.request.user,
            "party",
            None,
        )

        if AuthorizationService.is_admin(
            party=party,
        ):
            return Q()

        if AuthorizationService.has_permission(
            party=party,
            permission_code=PermissionCode.VERIFICATION_PERFORM,
        ):
            return Q()

        return Q(
            property__parties__party=party,
            property__parties__ended_at__isnull=True,
        )

    def _get_property(self, serializer):
        return serializer.validated_data.pop(
            "property"
        )


class PropertyLocationRecordViewSet(
    GeospatialQuerysetMixin,
    viewsets.GenericViewSet,
):
    permission_classes = [
        IsAuthenticated,
    ]

    serializer_class = PropertyLocationRecordSerializer
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_fields = [
        "property",
        "source_type",
        "captured_by",
        "is_primary",
    ]
    search_fields = [
        "notes",
        "property__reference_number",
    ]
    ordering_fields = [
        "created_at",
        "updated_at",
        "accuracy_meters",
    ]
    ordering = [
        "-created_at",
    ]

    queryset = (
        PropertyLocationRecord.objects
        .select_related(
            "property",
            "captured_by",
        )
    )

    def get_queryset(self):
        return self.queryset.filter(
            self._property_filter(),
        ).distinct()

    def create(self, request):
        serializer = PropertyLocationRecordSerializer(
            data=request.data,
        )
        serializer.is_valid(
            raise_exception=True,
        )

        property_obj = self._get_property(
            serializer,
        )

        try:
            location = GeospatialService.record_location(
                party=request.user.party,
                property_obj=property_obj,
                validated_data=serializer.validated_data,
            )
        except AuthorizationDenied:
            raise PermissionDenied(
                "You are not authorized to record this location."
            )

        return Response(
            PropertyLocationRecordSerializer(location).data,
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
        location = get_object_or_404(
            self.get_queryset(),
            pk=pk,
        )

        if not GeospatialPolicy.can_view(
            party=request.user.party,
            property=location.property,
        ):
            raise PermissionDenied()

        return Response(
            PropertyLocationRecordSerializer(location).data,
        )


class PropertyBoundaryViewSet(
    GeospatialQuerysetMixin,
    viewsets.GenericViewSet,
):
    permission_classes = [
        IsAuthenticated,
    ]

    serializer_class = PropertyBoundarySerializer
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_fields = [
        "property",
        "boundary_type",
        "source_type",
        "captured_by",
        "is_current",
    ]
    search_fields = [
        "notes",
        "property__reference_number",
    ]
    ordering_fields = [
        "created_at",
        "updated_at",
        "area_square_meters",
        "area_variance_percent",
    ]
    ordering = [
        "-created_at",
    ]

    queryset = (
        PropertyBoundary.objects
        .select_related(
            "property",
            "captured_by",
        )
    )

    def get_queryset(self):
        return self.queryset.filter(
            self._property_filter(),
        ).distinct()

    def create(self, request):
        serializer = PropertyBoundarySerializer(
            data=request.data,
        )
        serializer.is_valid(
            raise_exception=True,
        )

        property_obj = self._get_property(
            serializer,
        )

        try:
            boundary = GeospatialService.record_boundary(
                party=request.user.party,
                property_obj=property_obj,
                validated_data=serializer.validated_data,
            )
        except AuthorizationDenied:
            raise PermissionDenied(
                "You are not authorized to record this boundary."
            )

        return Response(
            PropertyBoundarySerializer(boundary).data,
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
        boundary = get_object_or_404(
            self.get_queryset(),
            pk=pk,
        )

        if not GeospatialPolicy.can_view(
            party=request.user.party,
            property=boundary.property,
        ):
            raise PermissionDenied()

        return Response(
            PropertyBoundarySerializer(boundary).data,
        )


class SiteRiskViewSet(
    GeospatialQuerysetMixin,
    viewsets.GenericViewSet,
):
    permission_classes = [
        IsAuthenticated,
    ]

    serializer_class = SiteRiskSerializer
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_fields = [
        "property",
        "risk_type",
        "severity",
        "source_type",
        "recorded_by",
    ]
    search_fields = [
        "description",
        "mitigation_notes",
        "property__reference_number",
    ]
    ordering_fields = [
        "created_at",
        "updated_at",
        "resolved_at",
    ]
    ordering = [
        "-created_at",
    ]

    queryset = (
        SiteRisk.objects
        .select_related(
            "property",
            "recorded_by",
        )
    )

    def get_queryset(self):
        return self.queryset.filter(
            self._property_filter(),
        ).distinct()

    def create(self, request):
        serializer = SiteRiskSerializer(
            data=request.data,
        )
        serializer.is_valid(
            raise_exception=True,
        )

        property_obj = self._get_property(
            serializer,
        )

        try:
            site_risk = GeospatialService.record_site_risk(
                party=request.user.party,
                property_obj=property_obj,
                validated_data=serializer.validated_data,
            )
        except AuthorizationDenied:
            raise PermissionDenied(
                "You are not authorized to record this site risk."
            )

        return Response(
            SiteRiskSerializer(site_risk).data,
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
        site_risk = get_object_or_404(
            self.get_queryset(),
            pk=pk,
        )

        if not GeospatialPolicy.can_view(
            party=request.user.party,
            property=site_risk.property,
        ):
            raise PermissionDenied()

        return Response(
            SiteRiskSerializer(site_risk).data,
        )
