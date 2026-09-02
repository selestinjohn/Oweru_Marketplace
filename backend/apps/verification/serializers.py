from rest_framework import serializers

from .models import (
    Verification,
    VerificationCheck,
    VerificationDecision,
    VerificationEvidence,
    VerificationFinding,
)

class VerificationSerializer(
    serializers.ModelSerializer
):

    class Meta:
        model = Verification

        fields = [
            "id",
            "property",
            "status",
            "requested_by",
            "assigned_verifier",
            "requested_at",
            "assigned_at",
            "started_at",
            "submitted_at",
            "decided_at",
            "decision_notes",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "status",
            "requested_by",
            "assigned_verifier",
            "requested_at",
            "assigned_at",
            "started_at",
            "submitted_at",
            "decided_at",
            "decision_notes",
            "created_at",
            "updated_at",
        ]


class VerificationCheckSerializer(
    serializers.ModelSerializer
):

    class Meta:
        model = VerificationCheck

        fields = [
            "id",
            "verification",
            "code",
            "title",
            "description",
            "status",
            "findings",
            "completed_at",
            "completed_by",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "completed_at",
            "completed_by",
            "created_at",
            "updated_at",
        ]


class VerificationFindingSerializer(
    serializers.ModelSerializer
):

    class Meta:
        model = VerificationFinding

        fields = [
            "id",
            "verification",
            "verification_check",
            "title",
            "description",
            "severity",
            "recorded_by",
            "recorded_at",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "recorded_by",
            "recorded_at",
            "created_at",
            "updated_at",
        ]


class VerificationEvidenceSerializer(
    serializers.ModelSerializer
):

    class Meta:
        model = VerificationEvidence

        fields = [
            "id",
            "verification",
            "evidence",
            "relevance_note",
            "linked_by",
            "linked_at",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "linked_by",
            "linked_at",
            "created_at",
            "updated_at",
        ]

    def validate(self, attrs):

        verification = attrs[
            "verification"
        ]

        evidence = attrs[
            "evidence"
        ]

        if (
            verification.property_id
            != evidence.property_id
        ):
            raise serializers.ValidationError(
                {
                    "evidence": (
                        "Evidence must belong "
                        "to the same property as "
                        "the verification."
                    )
                }
            )

        return attrs


class VerificationDecisionSerializer(
    serializers.ModelSerializer
):

    class Meta:
        model = VerificationDecision

        fields = [
            "id",
            "verification",
            "outcome",
            "summary",
            "decided_by",
            "decided_at",
            "expires_at",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "verification",
            "decided_by",
            "decided_at",
            "created_at",
            "updated_at",
        ]