from django.db import transaction
from django.utils import timezone

from apps.authorization.exceptions import (
    AuthorizationDenied,
)
from apps.audit.models import AuditCategory
from apps.audit.services import AuditService
from apps.verification.policies import VerificationPolicy

from .lifecycle import validate_transition
from .models import (
    Verification,
    VerificationDecision,
    VerificationStatus,
)


class VerificationService:

    @staticmethod
    @transaction.atomic
    def request_verification(
        *,
        party,
        property,
    ):

        if not VerificationPolicy.can_request(
            party=party,
            property=property,
        ):
            raise AuthorizationDenied()

        verification = Verification.objects.create(
            property=property,
            requested_by=party.user,
            status=(
                VerificationStatus.REQUESTED
            ),
        )

        AuditService.record(
            actor=party.user,
            category=AuditCategory.VERIFICATION,
            action="verification.requested",
            resource=verification,
            summary="Verification requested.",
            after={
                "property_id": str(property.id),
                "status": verification.status,
            },
            metadata={
                "party_id": str(party.id),
            },
        )

        return verification

    @staticmethod
    @transaction.atomic
    def assign_verifier(
        *,
        party,
        verification,
        verifier,
    ):

        if not VerificationPolicy.can_assign(
            party=party,
        ):
            raise AuthorizationDenied()

        validate_transition(
            current_status=verification.status,
            new_status=(
                VerificationStatus.ASSIGNED
            ),
        )

        previous_status = verification.status

        verification.assigned_verifier = (
            verifier
        )

        verification.status = (
            VerificationStatus.ASSIGNED
        )

        verification.assigned_at = (
            timezone.now()
        )

        verification.save(
            update_fields=[
                "assigned_verifier",
                "status",
                "assigned_at",
                "updated_at",
            ]
        )

        AuditService.record(
            actor=party.user,
            category=AuditCategory.VERIFICATION,
            action="verification.assigned",
            resource=verification,
            summary="Verifier assigned.",
            before={
                "status": previous_status,
            },
            after={
                "status": verification.status,
                "assigned_verifier_id": verifier.id,
            },
            metadata={
                "party_id": str(party.id),
            },
        )

        return verification


    @staticmethod
    @transaction.atomic
    def start_verification(
        *,
        party,
        verification,
    ):

        if not VerificationPolicy.can_execute(
            party=party,
            verification=verification,
        ):
            raise AuthorizationDenied()

        validate_transition(
            current_status=verification.status,
            new_status=(
                VerificationStatus.IN_PROGRESS
            ),
        )

        previous_status = verification.status

        verification.status = (
            VerificationStatus.IN_PROGRESS
        )

        verification.started_at = (
            timezone.now()
        )

        verification.save(
            update_fields=[
                "status",
                "started_at",
                "updated_at",
            ]
        )

        AuditService.record(
            actor=party.user,
            category=AuditCategory.VERIFICATION,
            action="verification.started",
            resource=verification,
            summary="Verification started.",
            before={
                "status": previous_status,
            },
            after={
                "status": verification.status,
                "started_at": verification.started_at.isoformat(),
            },
            metadata={
                "party_id": str(party.id),
            },
        )

        return verification


    @staticmethod
    @transaction.atomic
    def submit_verification(
        *,
        party,
        verification,
    ):

        if not VerificationPolicy.can_execute(
            party=party,
            verification=verification,
        ):
            raise AuthorizationDenied()

        validate_transition(
            current_status=verification.status,
            new_status=(
                VerificationStatus.SUBMITTED
            ),
        )

        previous_status = verification.status

        verification.status = (
            VerificationStatus.SUBMITTED
        )

        verification.submitted_at = (
            timezone.now()
        )

        verification.save(
            update_fields=[
                "status",
                "submitted_at",
                "updated_at",
            ]
        )

        AuditService.record(
            actor=party.user,
            category=AuditCategory.VERIFICATION,
            action="verification.submitted",
            resource=verification,
            summary="Verification submitted.",
            before={
                "status": previous_status,
            },
            after={
                "status": verification.status,
                "submitted_at": verification.submitted_at.isoformat(),
            },
            metadata={
                "party_id": str(party.id),
            },
        )

        return verification


    @staticmethod
    @transaction.atomic
    def decide(
        *,
        party,
        verification,
        outcome,
        summary,
        expires_at=None,
    ):

        if not VerificationPolicy.can_decide(
            party=party,
            verification=verification,
        ):
            raise AuthorizationDenied()

        validate_transition(
            current_status=verification.status,
            new_status=outcome,
        )

        previous_status = verification.status

        VerificationDecision.objects.create(
            verification=verification,
            outcome=outcome,
            summary=summary,
            decided_by=party.user,
            expires_at=expires_at,
        )

        verification.status = outcome

        verification.decided_at = (
            timezone.now()
        )

        verification.decision_notes = (
            summary
        )

        verification.save(
            update_fields=[
                "status",
                "decided_at",
                "decision_notes",
                "updated_at",
            ]
        )

        AuditService.record(
            actor=party.user,
            category=AuditCategory.VERIFICATION,
            action="verification.decided",
            resource=verification,
            summary="Verification decision recorded.",
            before={
                "status": previous_status,
            },
            after={
                "status": verification.status,
                "outcome": outcome,
                "decided_at": verification.decided_at.isoformat(),
            },
            metadata={
                "party_id": str(party.id),
                "expires_at": (
                    expires_at.isoformat()
                    if hasattr(expires_at, "isoformat")
                    else expires_at or ""
                ),
            },
        )

        return verification
