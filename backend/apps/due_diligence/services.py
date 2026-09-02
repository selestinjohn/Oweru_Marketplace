from django.db import transaction
from django.utils import timezone

from apps.audit.models import AuditCategory
from apps.audit.services import AuditService
from apps.authorization.exceptions import AuthorizationDenied
from apps.geospatial.models import PropertyBoundary, SiteRisk
from apps.notifications.models import NotificationType
from apps.notifications.services import NotificationService
from apps.properties.models import PropertyParty, PropertyPartyRole

from .models import (
    DueDiligenceFinding,
    DueDiligenceRequest,
    DueDiligenceStatus,
    RiskReport,
)
from .policies import DueDiligencePolicy


class DueDiligenceService:

    @staticmethod
    @transaction.atomic
    def request_due_diligence(
        *,
        party,
        property_obj,
        transaction_obj=None,
        validated_data=None,
    ):
        validated_data = validated_data or {}

        if not DueDiligencePolicy.can_request(
            party=party,
            property=property_obj,
            transaction=transaction_obj,
        ):
            raise AuthorizationDenied()

        request = DueDiligenceRequest.objects.create(
            property=property_obj,
            transaction=transaction_obj,
            requested_by_party=party,
            requested_by=party.user,
            **validated_data,
        )

        AuditService.record(
            actor=party.user,
            category=AuditCategory.DUE_DILIGENCE,
            action="due_diligence.requested",
            resource=request,
            summary="Due diligence requested.",
            after={
                "property_id": str(property_obj.id),
                "transaction_id": (
                    str(transaction_obj.id)
                    if transaction_obj
                    else ""
                ),
                "status": request.status,
            },
        )

        DueDiligenceService._notify_property_owners(
            actor_party=party,
            property_obj=property_obj,
            resource=request,
            title="Due diligence requested",
            message="A due diligence request was opened for your property.",
        )

        return request

    @staticmethod
    @transaction.atomic
    def start_review(
        *,
        party,
        request,
        assigned_reviewer=None,
    ):
        if not DueDiligencePolicy.can_review(
            party=party,
        ):
            raise AuthorizationDenied()

        if request.status != DueDiligenceStatus.REQUESTED:
            raise ValueError(
                "Only requested due diligence can move to review."
            )

        previous_status = request.status
        request.status = DueDiligenceStatus.IN_PROGRESS
        request.assigned_reviewer = assigned_reviewer or party.user
        request.started_at = timezone.now()
        request.save(
            update_fields=[
                "status",
                "assigned_reviewer",
                "started_at",
                "updated_at",
            ]
        )

        AuditService.record(
            actor=party.user,
            category=AuditCategory.DUE_DILIGENCE,
            action="due_diligence.review_started",
            resource=request,
            summary="Due diligence review started.",
            before={
                "status": previous_status,
            },
            after={
                "status": request.status,
                "assigned_reviewer": str(request.assigned_reviewer_id),
            },
        )

        return request

    @staticmethod
    @transaction.atomic
    def submit_report(
        *,
        party,
        request,
        validated_data,
    ):
        if not DueDiligencePolicy.can_review(
            party=party,
        ):
            raise AuthorizationDenied()

        if request.status not in {
            DueDiligenceStatus.REQUESTED,
            DueDiligenceStatus.IN_PROGRESS,
        }:
            raise ValueError(
                "Only requested or in-progress due diligence can be submitted."
            )

        findings = validated_data.pop(
            "findings",
            [],
        )
        evidence_summary = validated_data.pop(
            "evidence_summary",
            {},
        )
        evidence_summary["geospatial_snapshot"] = (
            DueDiligenceService._geospatial_snapshot(
                property_obj=request.property,
            )
        )

        report, _ = RiskReport.objects.update_or_create(
            due_diligence_request=request,
            defaults={
                **validated_data,
                "evidence_summary": evidence_summary,
                "prepared_by": party.user,
            },
        )

        for finding_data in findings:
            DueDiligenceFinding.objects.create(
                due_diligence_request=request,
                recorded_by=party.user,
                **finding_data,
            )

        previous_status = request.status
        request.status = DueDiligenceStatus.SUBMITTED
        request.submitted_at = timezone.now()
        if not request.assigned_reviewer_id:
            request.assigned_reviewer = party.user
        request.save(
            update_fields=[
                "status",
                "submitted_at",
                "assigned_reviewer",
                "updated_at",
            ]
        )

        AuditService.record(
            actor=party.user,
            category=AuditCategory.DUE_DILIGENCE,
            action="due_diligence.report_submitted",
            resource=request,
            summary="Due diligence risk report submitted.",
            before={
                "status": previous_status,
            },
            after={
                "status": request.status,
                "outcome": report.outcome,
                "report_id": str(report.id),
            },
        )

        NotificationService.notify_party(
            party=request.requested_by_party,
            title="Due diligence report submitted",
            message="A risk report is ready for your due diligence request.",
            notification_type=NotificationType.DUE_DILIGENCE,
            resource=request,
            payload={
                "status": request.status,
                "outcome": report.outcome,
                "report_id": str(report.id),
            },
            actor=party.user,
        )

        return report

    @staticmethod
    @transaction.atomic
    def decide(
        *,
        party,
        request,
        status,
        decision_notes="",
    ):
        if not DueDiligencePolicy.can_review(
            party=party,
        ):
            raise AuthorizationDenied()

        if request.status != DueDiligenceStatus.SUBMITTED:
            raise ValueError(
                "Only submitted due diligence can receive a decision."
            )

        if status not in {
            DueDiligenceStatus.APPROVED,
            DueDiligenceStatus.REJECTED,
        }:
            raise ValueError(
                "Due diligence decision must be approved or rejected."
            )

        previous_status = request.status
        request.status = status
        request.decision_notes = decision_notes
        request.decided_by = party.user
        request.decided_at = timezone.now()
        request.save(
            update_fields=[
                "status",
                "decision_notes",
                "decided_by",
                "decided_at",
                "updated_at",
            ]
        )

        AuditService.record(
            actor=party.user,
            category=AuditCategory.DUE_DILIGENCE,
            action="due_diligence.decided",
            resource=request,
            summary="Due diligence decision recorded.",
            before={
                "status": previous_status,
            },
            after={
                "status": request.status,
            },
        )

        NotificationService.notify_party(
            party=request.requested_by_party,
            title="Due diligence decision recorded",
            message="A decision was recorded for your due diligence request.",
            notification_type=NotificationType.DUE_DILIGENCE,
            resource=request,
            payload={
                "status": request.status,
            },
            actor=party.user,
        )

        return request

    @staticmethod
    @transaction.atomic
    def cancel(
        *,
        party,
        request,
        notes="",
    ):
        if not DueDiligencePolicy.can_cancel(
            party=party,
            request=request,
        ):
            raise AuthorizationDenied()

        if request.status not in {
            DueDiligenceStatus.REQUESTED,
            DueDiligenceStatus.IN_PROGRESS,
        }:
            raise ValueError(
                "Only requested or in-progress due diligence can be cancelled."
            )

        previous_status = request.status
        request.status = DueDiligenceStatus.CANCELLED
        request.decision_notes = notes
        request.decided_by = party.user
        request.decided_at = timezone.now()
        request.save(
            update_fields=[
                "status",
                "decision_notes",
                "decided_by",
                "decided_at",
                "updated_at",
            ]
        )

        AuditService.record(
            actor=party.user,
            category=AuditCategory.DUE_DILIGENCE,
            action="due_diligence.cancelled",
            resource=request,
            summary="Due diligence cancelled.",
            before={
                "status": previous_status,
            },
            after={
                "status": request.status,
            },
        )

        return request

    @staticmethod
    def _geospatial_snapshot(
        *,
        property_obj,
    ):
        risks = SiteRisk.objects.filter(
            property=property_obj,
            resolved_at__isnull=True,
        )

        return {
            "current_boundary_count": PropertyBoundary.objects.filter(
                property=property_obj,
                is_current=True,
            ).count(),
            "open_site_risk_count": risks.count(),
            "high_site_risk_count": risks.filter(
                severity__in=[
                    "HIGH",
                    "CRITICAL",
                ]
            ).count(),
        }

    @staticmethod
    def _notify_property_owners(
        *,
        actor_party,
        property_obj,
        resource,
        title,
        message,
    ):
        owner_relationships = (
            PropertyParty.objects
            .filter(
                property=property_obj,
                relationship=PropertyPartyRole.OWNER,
                ended_at__isnull=True,
            )
            .select_related(
                "party",
                "party__user",
            )
        )

        for relationship in owner_relationships:
            if relationship.party_id == actor_party.id:
                continue

            NotificationService.notify_party(
                party=relationship.party,
                title=title,
                message=message,
                notification_type=NotificationType.DUE_DILIGENCE,
                resource=resource,
                payload={
                    "property_id": str(property_obj.id),
                },
                actor=actor_party.user,
            )
