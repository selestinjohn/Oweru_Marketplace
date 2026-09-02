from rest_framework import serializers

from .models import Document, Evidence
from .validators import validate_document_file


class DocumentCreateSerializer(
    serializers.ModelSerializer,
):
    file = serializers.FileField(
        write_only=True,
        required=False,
    )

    file_reference = serializers.CharField(
        required=False,
        allow_blank=False,
    )

    class Meta:
        model = Document

        fields = [
            "property",
            "document_type",
            "source_type",
            "file",
            "file_reference",
            "description",
            "issued_at",
            "expires_at",
        ]

        read_only_fields = [
            "status",
        ]

    def validate_file(self, value):

        return validate_document_file(
            value
        )

    def validate(self, attrs):

        issued_at = attrs.get(
            "issued_at"
        )

        expires_at = attrs.get(
            "expires_at"
        )

        if (
            issued_at
            and expires_at
            and expires_at <= issued_at
        ):
            raise serializers.ValidationError(
                {
                    "expires_at": (
                        "Expiry date must be "
                        "after the issue date."
                    )
                }
            )

        if not attrs.get("file") and not attrs.get("file_reference"):
            raise serializers.ValidationError(
                {
                    "file": (
                        "A document file or file reference "
                        "is required."
                    )
                }
            )

        return attrs




class DocumentSerializer(
    serializers.ModelSerializer,
):

    class Meta:
        model = Document

        fields = [
            "id",
            "property",
            "document_type",
            "source_type",
            "status",
            "description",
            "sighted_at",
            "issued_at",
            "expires_at",
            "uploaded_by",
            "created_at",
            "updated_at",
        ]

        read_only_fields = fields



class EvidenceSerializer(
    serializers.ModelSerializer,
):

    class Meta:
        model = Evidence

        fields = [
            "id",
            "property",
            "document",
            "source_type",
            "title",
            "description",
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


class EvidenceCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Evidence
        fields = [
            "property",
            "document",
            "source_type",
            "title",
            "description",
        ]

    def validate(self, attrs):
        property = attrs["property"]
        document = attrs.get("document")

        if document and document.property_id != property.id:
            raise serializers.ValidationError(
                {
                    "document": (
                        "Document must belong to the selected property."
                    )
                }
            )

        return attrs
