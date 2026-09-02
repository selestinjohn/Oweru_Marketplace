from django.conf import settings
from django.db import models

from apps.core.models import TimeStampedModel
from apps.parties.models import Party
from apps.properties.models import Property
from apps.transactions.models import Transaction


class DueDiligenceStatus(models.TextChoices):
    REQUESTED = "REQUESTED", "Requested"
    IN_PROGRESS = "IN_PROGRESS", "In progress"
    SUBMITTED = "SUBMITTED", "Submitted"
    APPROVED = "APPROVED", "Approved"
    REJECTED = "REJECTED", "Rejected"
    CANCELLED = "CANCELLED", "Cancelled"


class RiskOutcome(models.TextChoices):
    LOW_RISK = "LOW_RISK", "Low risk"
    MEDIUM_RISK = "MEDIUM_RISK", "Medium risk"
    HIGH_RISK = "HIGH_RISK", "High risk"
    BLOCKED = "BLOCKED", "Blocked"


class DueDiligenceFindingCategory(models.TextChoices):
    TITLE = "TITLE", "Title"
    PARTY = "PARTY", "Party"
    GEOSPATIAL = "GEOSPATIAL", "Geospatial"
    PAYMENT = "PAYMENT", "Payment"
    DOCUMENT = "DOCUMENT", "Document"
    LEGAL = "LEGAL", "Legal"
    OTHER = "OTHER", "Other"


class DueDiligenceFindingSeverity(models.TextChoices):
    INFORMATIONAL = "INFORMATIONAL", "Informational"
    LOW = "LOW", "Low"
    MEDIUM = "MEDIUM", "Medium"
    HIGH = "HIGH", "High"
    CRITICAL = "CRITICAL", "Critical"


class DueDiligenceRequest(TimeStampedModel):
    property = models.ForeignKey(
        Property,
        on_delete=models.PROTECT,
        related_name="due_diligence_requests",
    )

    transaction = models.ForeignKey(
        Transaction,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="due_diligence_requests",
    )

    requested_by_party = models.ForeignKey(
        Party,
        on_delete=models.PROTECT,
        related_name="due_diligence_requests",
    )

    requested_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="due_diligence_requests",
    )

    assigned_reviewer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="assigned_due_diligence_requests",
    )

    status = models.CharField(
        max_length=30,
        choices=DueDiligenceStatus.choices,
        default=DueDiligenceStatus.REQUESTED,
    )

    requested_checks = models.JSONField(
        default=list,
        blank=True,
    )

    notes = models.TextField(
        blank=True,
    )

    requested_at = models.DateTimeField(
        auto_now_add=True,
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

    decided_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="decided_due_diligence_requests",
    )

    decision_notes = models.TextField(
        blank=True,
    )

    class Meta:
        indexes = [
            models.Index(
                fields=[
                    "property",
                    "status",
                ]
            ),
            models.Index(
                fields=[
                    "transaction",
                    "status",
                ]
            ),
            models.Index(
                fields=[
                    "requested_by_party",
                    "status",
                ]
            ),
            models.Index(
                fields=[
                    "assigned_reviewer",
                    "status",
                ]
            ),
        ]
        ordering = [
            "-created_at",
        ]

    def __str__(self):
        return f"Due diligence for {self.property}"


class RiskReport(TimeStampedModel):
    due_diligence_request = models.OneToOneField(
        DueDiligenceRequest,
        on_delete=models.CASCADE,
        related_name="risk_report",
    )

    outcome = models.CharField(
        max_length=30,
        choices=RiskOutcome.choices,
    )

    summary = models.TextField()

    title_summary = models.TextField(
        blank=True,
    )

    party_summary = models.TextField(
        blank=True,
    )

    geospatial_summary = models.TextField(
        blank=True,
    )

    payment_summary = models.TextField(
        blank=True,
    )

    evidence_summary = models.JSONField(
        default=dict,
        blank=True,
    )

    prepared_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="prepared_risk_reports",
    )

    issued_at = models.DateTimeField(
        auto_now_add=True,
    )

    expires_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    class Meta:
        indexes = [
            models.Index(
                fields=[
                    "outcome",
                    "issued_at",
                ]
            ),
            models.Index(
                fields=[
                    "prepared_by",
                    "issued_at",
                ]
            ),
        ]
        ordering = [
            "-issued_at",
        ]

    def __str__(self):
        return f"{self.outcome} report for {self.due_diligence_request_id}"


class DueDiligenceFinding(TimeStampedModel):
    due_diligence_request = models.ForeignKey(
        DueDiligenceRequest,
        on_delete=models.CASCADE,
        related_name="findings",
    )

    category = models.CharField(
        max_length=30,
        choices=DueDiligenceFindingCategory.choices,
    )

    severity = models.CharField(
        max_length=30,
        choices=DueDiligenceFindingSeverity.choices,
        default=DueDiligenceFindingSeverity.INFORMATIONAL,
    )

    title = models.CharField(
        max_length=255,
    )

    description = models.TextField()

    recommendation = models.TextField(
        blank=True,
    )

    recorded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="due_diligence_findings",
    )

    class Meta:
        indexes = [
            models.Index(
                fields=[
                    "due_diligence_request",
                    "severity",
                ]
            ),
            models.Index(
                fields=[
                    "category",
                    "severity",
                ]
            ),
        ]
        ordering = [
            "-created_at",
        ]

    def __str__(self):
        return self.title
