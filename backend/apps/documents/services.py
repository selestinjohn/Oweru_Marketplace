from django.core.files.storage import default_storage
from django.db import transaction

from apps.authorization.exceptions import (
    AuthorizationDenied,
)
from apps.authorization.policies import (
    DocumentPolicy,
)
from apps.audit.models import AuditCategory
from apps.audit.services import AuditService

from .models import Document, DocumentReview, Evidence
from .storage import (
    generate_document_path,
    get_document_content_type,
    open_document,
)

from .exceptions import (
    InvalidDocumentTransition,
)
from .lifecycle import (
    validate_document_transition,
)
class DocumentService:
    @staticmethod
    @transaction.atomic
    def create_document(
        *,
        party,
        property,
        validated_data,
    ):
        if not DocumentPolicy.can_create(
            party=party,
            property=property,
        ):
            raise AuthorizationDenied()

        uploaded_file = validated_data.pop(
            "file",
            None,
        )

        stored_path = None

        try:
            if uploaded_file:
                file_path = generate_document_path(
                    instance=None,
                    filename=uploaded_file.name,
                )

                stored_path = default_storage.save(
                    file_path,
                    uploaded_file,
                )

                validated_data["file_reference"] = stored_path

            document = Document.objects.create(
                property=property,
                uploaded_by=party.user,
                **validated_data,
            )

        except Exception:
            if stored_path:
                default_storage.delete(
                    stored_path
                )

            raise

        AuditService.record(
            actor=party.user,
            category=AuditCategory.DOCUMENT,
            action="document.created",
            resource=document,
            summary="Document recorded.",
            after={
                "property_id": str(property.id),
                "document_type": document.document_type,
                "source_type": document.source_type,
                "status": document.status,
            },
            metadata={
                "party_id": str(party.id),
                "has_uploaded_file": bool(uploaded_file),
            },
        )

        return document

    @staticmethod
    def get_document_for_download(
        *,
        party,
        document,
    ):
        if not DocumentPolicy.can_view(
            party=party,
            document=document,
        ):
            raise AuthorizationDenied()

        if not default_storage.exists(
            document.file_reference
        ):
            raise FileNotFoundError(
                "Document file not found."
            )

        file_handle = open_document(
            document.file_reference
        )

        content_type = (
            get_document_content_type(
                document.file_reference
            )
        )

        return file_handle, content_type

    @staticmethod
    @transaction.atomic
    def change_status(
        *,
        party,
        document,
        new_status,
    ):
        if not DocumentPolicy.can_review(
            party=party,
            document=document,
        ):
            raise AuthorizationDenied()

        validate_document_transition(
            current_status=document.status,
            new_status=new_status,
        )

        document.status = new_status
        document.save(update_fields=["status", "updated_at"])

        return document


class EvidenceService:

    @staticmethod
    @transaction.atomic
    def create_evidence(
        *,
        party,
        property,
        validated_data,
    ):
        evidence = Evidence.objects.create(
            property=property,
            recorded_by=party.user,
            **validated_data,
        )

        AuditService.record(
            actor=party.user,
            category=AuditCategory.DOCUMENT,
            action="evidence.created",
            resource=evidence,
            summary="Property evidence recorded.",
            after={
                "property_id": str(property.id),
                "source_type": evidence.source_type,
                "title": evidence.title,
            },
            metadata={
                "party_id": str(party.id),
                "document_id": (
                    str(evidence.document_id)
                    if evidence.document_id
                    else ""
                ),
            },
        )

        return evidence


class DocumentReviewService:

    @staticmethod
    @transaction.atomic
    def change_status(
        *,
        party,
        document,
        new_status,
        reason="",
    ):
        if not DocumentPolicy.can_review(
            party=party,
            document=document,
        ):
            raise AuthorizationDenied()

        validate_document_transition(
            current_status=document.status,
            new_status=new_status,
        )

        previous_status = document.status

        DocumentReview.objects.create(
            document=document,
            reviewer=party.user,
            previous_status=previous_status,
            new_status=new_status,
            reason=reason,
        )

        document.status = new_status
        document.save(update_fields=["status", "updated_at"])

        AuditService.record(
            actor=party.user,
            category=AuditCategory.DOCUMENT,
            action="document.reviewed",
            resource=document,
            summary="Document review status changed.",
            before={
                "status": previous_status,
            },
            after={
                "status": document.status,
            },
            metadata={
                "party_id": str(party.id),
                "reason": reason,
            },
        )

        return document
