from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.authorization.exceptions import AuthorizationDenied
from apps.properties.models import Property

from .exceptions import InvalidVerificationTransition
from .models import (
    Verification,
    VerificationCheck,
    VerificationFinding,
    VerificationEvidence,
)
from .serializers import (
    VerificationSerializer,
    VerificationCheckSerializer,
    VerificationFindingSerializer,
    VerificationEvidenceSerializer,
)
from .services import VerificationService


User = get_user_model()


class VerificationViewSet(viewsets.GenericViewSet):
    """
    API endpoints for managing property verification workflows.
    """

    permission_classes = [
        IsAuthenticated,
    ]

    queryset = (
        Verification.objects
        .select_related(
            "property",
            "requested_by",
            "assigned_verifier",
        )
        .prefetch_related(
            "checks",
            "findings",
            "evidence_links",
        )
    )

    serializer_class = VerificationSerializer

    # ============================================================
    # LIST
    # ============================================================

    def list(self, request):
        queryset = self.get_queryset()

        serializer = self.get_serializer(
            queryset,
            many=True,
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

    # ============================================================
    # RETRIEVE
    # ============================================================

    def retrieve(
        self,
        request,
        pk=None,
    ):
        verification = get_object_or_404(
            self.get_queryset(),
            pk=pk,
        )

        serializer = self.get_serializer(
            verification,
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

    # ============================================================
    # CREATE / REQUEST VERIFICATION
    # ============================================================

    def create(
        self,
        request,
    ):
        property_id = request.data.get(
            "property",
        )

        if not property_id:
            return Response(
                {
                    "property": [
                        "This field is required."
                    ]
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        property_obj = get_object_or_404(
            Property,
            pk=property_id,
        )

        try:
            party = request.user.party
        except request.user.__class__.party.RelatedObjectDoesNotExist:
            raise PermissionDenied(
                "Authenticated user does not have a party."
            )

        try:
            verification = (
                VerificationService
                .request_verification(
                    party=party,
                    property=property_obj,
                )
            )

        except AuthorizationDenied:
            raise PermissionDenied(
                "You are not authorized "
                "to request verification."
            )

        serializer = self.get_serializer(
            verification,
        )

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
        )

    # ============================================================
    # ASSIGN VERIFIER
    # ============================================================

    @action(
        detail=True,
        methods=["post"],
        url_path="assign",
    )
    def assign(
        self,
        request,
        pk=None,
    ):
        verification = get_object_or_404(
            self.get_queryset(),
            pk=pk,
        )

        verifier_id = request.data.get(
            "verifier",
        )

        if not verifier_id:
            return Response(
                {
                    "verifier": [
                        "This field is required."
                    ]
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        verifier = get_object_or_404(
            User,
            pk=verifier_id,
        )

        try:
            verification = (
                VerificationService
                .assign_verifier(
                    party=request.user.party,
                    verification=verification,
                    verifier=verifier,
                )
            )

        except AuthorizationDenied:
            raise PermissionDenied(
                "You are not authorized "
                "to assign verifiers."
            )

        except InvalidVerificationTransition as exc:
            return Response(
                {
                    "detail": str(exc),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            self.get_serializer(
                verification,
            ).data,
            status=status.HTTP_200_OK,
        )

    # ============================================================
    # START VERIFICATION
    # ============================================================

    @action(
        detail=True,
        methods=["post"],
        url_path="start",
    )
    def start(
        self,
        request,
        pk=None,
    ):
        verification = get_object_or_404(
            self.get_queryset(),
            pk=pk,
        )

        try:
            verification = (
                VerificationService
                .start_verification(
                    party=request.user.party,
                    verification=verification,
                )
            )

        except AuthorizationDenied:
            raise PermissionDenied(
                "You are not the assigned "
                "verifier for this verification."
            )

        except InvalidVerificationTransition as exc:
            return Response(
                {
                    "detail": str(exc),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            self.get_serializer(
                verification,
            ).data,
            status=status.HTTP_200_OK,
        )

    # ============================================================
    # SUBMIT VERIFICATION
    # ============================================================

    @action(
        detail=True,
        methods=["post"],
        url_path="submit",
    )
    def submit(
        self,
        request,
        pk=None,
    ):
        verification = get_object_or_404(
            self.get_queryset(),
            pk=pk,
        )

        try:
            verification = (
                VerificationService
                .submit_verification(
                    party=request.user.party,
                    verification=verification,
                )
            )

        except AuthorizationDenied:
            raise PermissionDenied(
                "You are not authorized "
                "to submit this verification."
            )

        except InvalidVerificationTransition as exc:
            return Response(
                {
                    "detail": str(exc),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            self.get_serializer(
                verification,
            ).data,
            status=status.HTTP_200_OK,
        )

    # ============================================================
    # VERIFICATION DECISION
    # ============================================================

    @action(
        detail=True,
        methods=["post"],
        url_path="decision",
    )
    def decision(
        self,
        request,
        pk=None,
    ):
        verification = get_object_or_404(
            self.get_queryset(),
            pk=pk,
        )

        outcome = request.data.get(
            "outcome",
        )

        summary = request.data.get(
            "summary",
            "",
        )

        expires_at = request.data.get(
            "expires_at",
        )

        if outcome not in {
            "APPROVED",
            "REJECTED",
        }:
            return Response(
                {
                    "outcome": [
                        "Outcome must be "
                        "APPROVED or REJECTED."
                    ]
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not summary:
            return Response(
                {
                    "summary": [
                        "Decision summary is required."
                    ]
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            verification = (
                VerificationService
                .decide(
                    party=request.user.party,
                    verification=verification,
                    outcome=outcome,
                    summary=summary,
                    expires_at=expires_at,
                )
            )

        except AuthorizationDenied:
            raise PermissionDenied(
                "You are not authorized "
                "to make this decision."
            )

        except InvalidVerificationTransition as exc:
            return Response(
                {
                    "detail": str(exc),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            self.get_serializer(
                verification,
            ).data,
            status=status.HTTP_200_OK,
        )

    # ============================================================
    # ADD VERIFICATION CHECK
    # ============================================================

    @action(
        detail=True,
        methods=["post"],
        url_path="checks",
    )
    def checks(
        self,
        request,
        pk=None,
    ):
        verification = get_object_or_404(
            self.get_queryset(),
            pk=pk,
        )

        if (
            verification.assigned_verifier_id
            != request.user.id
        ):
            raise PermissionDenied(
                "Only the assigned verifier "
                "can record verification checks."
            )

        serializer = VerificationCheckSerializer(
            data={
                **request.data,
                "verification": verification.id,
            }
        )

        serializer.is_valid(
            raise_exception=True,
        )

        check = serializer.save(
            completed_by=request.user,
        )

        return Response(
            VerificationCheckSerializer(
                check,
            ).data,
            status=status.HTTP_201_CREATED,
        )

    # ============================================================
    # ADD FINDING
    # ============================================================

    @action(
        detail=True,
        methods=["post"],
        url_path="findings",
    )
    def findings(
        self,
        request,
        pk=None,
    ):
        verification = get_object_or_404(
            self.get_queryset(),
            pk=pk,
        )

        if (
            verification.assigned_verifier_id
            != request.user.id
        ):
            raise PermissionDenied(
                "Only the assigned verifier "
                "can record findings."
            )

        serializer = VerificationFindingSerializer(
            data={
                **request.data,
                "verification": verification.id,
            }
        )

        serializer.is_valid(
            raise_exception=True,
        )

        finding = serializer.save(
            recorded_by=request.user,
        )

        return Response(
            VerificationFindingSerializer(
                finding,
            ).data,
            status=status.HTTP_201_CREATED,
        )

    # ============================================================
    # ADD EVIDENCE
    # ============================================================

    @action(
        detail=True,
        methods=["post"],
        url_path="evidence",
    )
    def evidence(
        self,
        request,
        pk=None,
    ):
        verification = get_object_or_404(
            self.get_queryset(),
            pk=pk,
        )

        if (
            verification.assigned_verifier_id
            != request.user.id
        ):
            raise PermissionDenied(
                "Only the assigned verifier "
                "can attach verification evidence."
            )

        serializer = VerificationEvidenceSerializer(
            data={
                **request.data,
                "verification": verification.id,
            }
        )

        serializer.is_valid(
            raise_exception=True,
        )

        evidence_link = serializer.save(
            linked_by=request.user,
        )

        return Response(
            VerificationEvidenceSerializer(
                evidence_link,
            ).data,
            status=status.HTTP_201_CREATED,
        )