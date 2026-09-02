from pathlib import Path

from django.http import FileResponse
from django.shortcuts import get_object_or_404
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import NotFound, PermissionDenied
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.authorization.exceptions import AuthorizationDenied
from apps.authorization.policies import (
    DocumentPolicy,
    EvidencePolicy,
)
from apps.documents.exceptions import InvalidDocumentTransition

from .models import (
    Document,
    Evidence,
)
from .serializers import (
    DocumentCreateSerializer,
    DocumentSerializer,
    EvidenceSerializer,
    EvidenceCreateSerializer,
)
from .services import (
    DocumentService,
    DocumentReviewService,
    EvidenceService,
)


class DocumentViewSet(viewsets.GenericViewSet):
    permission_classes = [
        IsAuthenticated,
    ]
    parser_classes = [
        JSONParser,
        MultiPartParser,
        FormParser,
    ]

    def create(
        self,
        request,
    ):
        serializer = DocumentCreateSerializer(
            data=request.data,
        )
        serializer.is_valid(
            raise_exception=True,
        )

        validated_data = dict(
            serializer.validated_data,
        )
        property = validated_data.pop(
            "property"
        )

        document = DocumentService.create_document(
            party=request.user.party,
            property=property,
            validated_data=validated_data,
        )

        return Response(
            DocumentSerializer(
                document
            ).data,
            status=status.HTTP_201_CREATED,
        )

    def retrieve(
        self,
        request,
        pk=None,
    ):
        document = get_object_or_404(
            Document,
            pk=pk,
        )

        if not DocumentPolicy.can_view(
            party=request.user.party,
            document=document,
        ):
            raise PermissionDenied()

        return Response(
            DocumentSerializer(
                document
            ).data,
        )

    @action(
        detail=True,
        methods=["get"],
        url_path="download",
    )
    def download(
        self,
        request,
        pk=None,
    ):
        document = get_object_or_404(
            Document,
            pk=pk,
        )

        try:
            file_handle, content_type = (
                DocumentService.get_document_for_download(
                    party=request.user.party,
                    document=document,
                )
            )
        except AuthorizationDenied:
            raise PermissionDenied(
                "You are not authorized to access this document."
            )
        except FileNotFoundError:
            raise NotFound(
                "Document file not found."
            )

        extension = Path(
            document.file_reference
        ).suffix.lower()
        filename = (
            f"{document.document_type.lower()}"
            f"-document{extension}"
        )

        return FileResponse(
            file_handle,
            as_attachment=True,
            filename=filename,
            content_type=content_type,
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
        document = get_object_or_404(
            Document,
            pk=pk,
        )

        new_status = request.data.get(
            "status"
        )
        reason = request.data.get(
            "reason",
            "",
        )

        if not new_status:
            return Response(
                {
                    "detail": "status is required."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            document = (
                DocumentReviewService
                .change_status(
                    party=request.user.party,
                    document=document,
                    new_status=new_status,
                    reason=reason,
                )
            )
        except AuthorizationDenied:
            raise PermissionDenied(
                "You are not authorized to review this document."
            )
        except InvalidDocumentTransition as exc:
            return Response(
                {
                    "detail": str(exc)
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            DocumentSerializer(document).data
        )



class EvidenceViewSet(
    viewsets.GenericViewSet,
):

    permission_classes = [
        IsAuthenticated,
    ]

    def create(
        self,
        request,
    ):

        serializer = (
            EvidenceCreateSerializer(
                data=request.data
            )
        )

        serializer.is_valid(
            raise_exception=True
        )

        party = request.user.party

        validated_data = dict(
            serializer.validated_data
        )
        property = validated_data.pop(
            "property"
        )

        if not EvidencePolicy.can_create(
            party=party,
            property=property,
        ):
            raise PermissionDenied(
                "You are not authorized "
                "to record evidence for "
                "this property."
            )

        evidence = (
            EvidenceService.create_evidence(
                party=party,
                property=property,
                validated_data=validated_data,
            )
        )

        return Response(
            EvidenceSerializer(
                evidence
            ).data,
            status=status.HTTP_201_CREATED,
        )
