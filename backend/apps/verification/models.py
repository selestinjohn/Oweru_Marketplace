from django.conf import settings
from django.db import models

from apps.core.models import TimeStampedModel
from apps.properties.models import Property


class VerificationStatus(models.TextChoices):

    REQUESTED = (
        "REQUESTED",
        "Requested",
    )

    ASSIGNED = (
        "ASSIGNED",
        "Assigned",
    )

    IN_PROGRESS = (
        "IN_PROGRESS",
        "In progress",
    )

    SUBMITTED = (
        "SUBMITTED",
        "Submitted",
    )

    APPROVED = (
        "APPROVED",
        "Approved",
    )

    REJECTED = (
        "REJECTED",
        "Rejected",
    )

    EXPIRED = (
        "EXPIRED",
        "Expired",
    )

    CANCELLED = (
        "CANCELLED",
        "Cancelled",
    )





class Verification(TimeStampedModel):

    property = models.ForeignKey(
        Property,
        on_delete=models.PROTECT,
        related_name="verifications",
    )

    status = models.CharField(
        max_length=30,
        choices=VerificationStatus.choices,
        default=VerificationStatus.REQUESTED,
    )

    requested_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="verification_requests",
    )

    assigned_verifier = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="assigned_verifications",
    )

    requested_at = models.DateTimeField(
        auto_now_add=True,
    )

    assigned_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    started_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    submitted_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    decided_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    decision_notes = models.TextField(
        blank=True,
    )



class VerificationCheckStatus(
    models.TextChoices
):

    NOT_STARTED = (
        "NOT_STARTED",
        "Not started",
    )

    PASS = (
        "PASS",
        "Pass",
    )

    FAIL = (
        "FAIL",
        "Fail",
    )

    NOT_APPLICABLE = (
        "NOT_APPLICABLE",
        "Not applicable",
    )




class VerificationCheck(
    TimeStampedModel
):

    verification = models.ForeignKey(
        Verification,
        on_delete=models.PROTECT,
        related_name="checks",
    )

    code = models.CharField(
        max_length=100,
    )

    title = models.CharField(
        max_length=255,
    )

    description = models.TextField(
        blank=True,
    )

    status = models.CharField(
        max_length=30,
        choices=VerificationCheckStatus.choices,
        default=(
            VerificationCheckStatus.NOT_STARTED
        ),
    )

    findings = models.TextField(
        blank=True,
    )

    completed_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    completed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="completed_verification_checks",
    )



class FindingSeverity(models.TextChoices):

    INFORMATIONAL = (
        "INFORMATIONAL",
        "Informational",
    )

    LOW = (
        "LOW",
        "Low",
    )

    MEDIUM = (
        "MEDIUM",
        "Medium",
    )

    HIGH = (
        "HIGH",
        "High",
    )

    CRITICAL = (
        "CRITICAL",
        "Critical",
    )


class VerificationFinding(
    TimeStampedModel
):

    verification = models.ForeignKey(
        Verification,
        on_delete=models.PROTECT,
        related_name="findings",
    )

    verification_check = models.ForeignKey(
        VerificationCheck,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="finding_records",
    )

    title = models.CharField(
        max_length=255,
    )

    description = models.TextField()

    severity = models.CharField(
        max_length=30,
        choices=FindingSeverity.choices,
        default=FindingSeverity.INFORMATIONAL,
    )

    recorded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="verification_findings",
    )

    recorded_at = models.DateTimeField(
        auto_now_add=True,
    )



class VerificationEvidence(
    TimeStampedModel
):

    verification = models.ForeignKey(
        Verification,
        on_delete=models.PROTECT,
        related_name="evidence_links",
    )

    evidence = models.ForeignKey(
        "documents.Evidence",
        on_delete=models.PROTECT,
        related_name="verification_links",
    )

    relevance_note = models.TextField(
        blank=True,
    )

    linked_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="linked_verification_evidence",
    )

    linked_at = models.DateTimeField(
        auto_now_add=True,
    )


class VerificationDecision(
    TimeStampedModel
):

    verification = models.OneToOneField(
        Verification,
        on_delete=models.PROTECT,
        related_name="decision",
    )

    outcome = models.CharField(
        max_length=30,
        choices=(
            ("APPROVED", "Approved"),
            ("REJECTED", "Rejected"),
        ),
    )

    summary = models.TextField()

    decided_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="verification_decisions",
    )

    decided_at = models.DateTimeField(
        auto_now_add=True,
    )

    expires_at = models.DateTimeField(
        null=True,
        blank=True,
    )
