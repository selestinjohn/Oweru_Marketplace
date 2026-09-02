from .exceptions import (
    InvalidDocumentTransition,
)
from .models import DocumentStatus


ALLOWED_DOCUMENT_TRANSITIONS = {

    DocumentStatus.SUBMITTED: {
        DocumentStatus.UNDER_REVIEW,
    },

    DocumentStatus.UNDER_REVIEW: {
        DocumentStatus.ACCEPTED,
        DocumentStatus.REJECTED,
    },

    DocumentStatus.ACCEPTED: {
        DocumentStatus.EXPIRED,
    },

    DocumentStatus.REJECTED: {
        DocumentStatus.UNDER_REVIEW,
    },

    DocumentStatus.EXPIRED: {
        DocumentStatus.UNDER_REVIEW,
    },
}


def validate_document_transition(
    *,
    current_status,
    new_status,
):

    allowed = (
        ALLOWED_DOCUMENT_TRANSITIONS
        .get(current_status, set())
    )

    if new_status not in allowed:
        raise InvalidDocumentTransition(
            f"Cannot transition document "
            f"from {current_status} "
            f"to {new_status}."
        )