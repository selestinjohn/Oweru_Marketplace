from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import (
    DueDiligenceFinding,
    DueDiligenceRequest,
    DueDiligenceStatus,
    RiskReport,
)


User = get_user_model()


class DueDiligenceFindingSerializer(serializers.ModelSerializer):

    class Meta:
        model = DueDiligenceFinding

        fields = [
            "id",
            "due_diligence_request",
            "category",
            "severity",
            "title",
            "description",
            "recommendation",
            "recorded_by",
            "created_at",
            "updated_at",
        ]

        read_only_fields = fields


class RiskReportSerializer(serializers.ModelSerializer):

    class Meta:
        model = RiskReport

        fields = [
            "id",
            "due_diligence_request",
            "outcome",
            "summary",
            "title_summary",
            "party_summary",
            "geospatial_summary",
            "payment_summary",
            "evidence_summary",
            "prepared_by",
            "issued_at",
            "expires_at",
            "created_at",
            "updated_at",
        ]

        read_only_fields = fields


class DueDiligenceRequestSerializer(serializers.ModelSerializer):
    risk_report = RiskReportSerializer(
        read_only=True,
    )
    findings = DueDiligenceFindingSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = DueDiligenceRequest

        fields = [
            "id",
            "property",
            "transaction",
            "requested_by_party",
            "requested_by",
            "assigned_reviewer",
            "status",
            "requested_checks",
            "notes",
            "requested_at",
            "started_at",
            "submitted_at",
            "decided_at",
            "decided_by",
            "decision_notes",
            "risk_report",
            "findings",
            "created_at",
            "updated_at",
        ]

        read_only_fields = fields


class DueDiligenceRequestCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = DueDiligenceRequest

        fields = [
            "property",
            "transaction",
            "requested_checks",
            "notes",
        ]

    def validate(self, attrs):
        transaction = attrs.get("transaction")
        property_obj = attrs.get("property")

        if transaction:
            if transaction.property_id != property_obj.id:
                raise serializers.ValidationError(
                    "Transaction does not belong to the selected property."
                )

        return attrs


class DueDiligenceStartReviewSerializer(serializers.Serializer):
    assigned_reviewer = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        required=False,
        allow_null=True,
    )


class DueDiligenceFindingCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = DueDiligenceFinding

        fields = [
            "category",
            "severity",
            "title",
            "description",
            "recommendation",
        ]


class RiskReportSubmitSerializer(serializers.ModelSerializer):
    evidence_summary = serializers.JSONField(
        required=False,
        default=dict,
    )
    findings = DueDiligenceFindingCreateSerializer(
        many=True,
        required=False,
    )

    class Meta:
        model = RiskReport

        fields = [
            "outcome",
            "summary",
            "title_summary",
            "party_summary",
            "geospatial_summary",
            "payment_summary",
            "evidence_summary",
            "expires_at",
            "findings",
        ]


class DueDiligenceDecisionSerializer(serializers.Serializer):
    status = serializers.ChoiceField(
        choices=[
            DueDiligenceStatus.APPROVED,
            DueDiligenceStatus.REJECTED,
        ],
    )
    decision_notes = serializers.CharField(
        required=False,
        allow_blank=True,
    )


class DueDiligenceCancelSerializer(serializers.Serializer):
    notes = serializers.CharField(
        required=False,
        allow_blank=True,
    )
