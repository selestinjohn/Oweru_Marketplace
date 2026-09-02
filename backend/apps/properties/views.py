from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Property

from .serializers import (
    PropertyCreateSerializer,
    PropertySerializer,
)
from .services import PropertyService


class PropertyViewSet(
    viewsets.GenericViewSet,
):

    permission_classes = [
        IsAuthenticated,
    ]

    def create(self, request):

        serializer = PropertyCreateSerializer(
            data=request.data,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        party = request.user.party

        property = PropertyService.create_property(
            party=party,
            validated_data=serializer.validated_data,
        )

        return Response(
            PropertySerializer(property).data,
            status=status.HTTP_201_CREATED,
        )