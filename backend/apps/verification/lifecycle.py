from .models import VerificationStatus

from .exceptions import (
    InvalidVerificationTransition,
)

ALLOWED_TRANSITIONS = {

    VerificationStatus.REQUESTED: {
        VerificationStatus.ASSIGNED,
        VerificationStatus.CANCELLED,
    },

    VerificationStatus.ASSIGNED: {
        VerificationStatus.IN_PROGRESS,
        VerificationStatus.CANCELLED,
    },

    VerificationStatus.IN_PROGRESS: {
        VerificationStatus.SUBMITTED,
        VerificationStatus.CANCELLED,
    },

    VerificationStatus.SUBMITTED: {
        VerificationStatus.APPROVED,
        VerificationStatus.REJECTED,
    },

    VerificationStatus.APPROVED: {
        VerificationStatus.EXPIRED,
    },

    VerificationStatus.REJECTED: {
        VerificationStatus.ASSIGNED,
    },

    VerificationStatus.EXPIRED: {
        VerificationStatus.ASSIGNED,
    },
}




def validate_transition(
    *,
    current_status,
    new_status,
):

    allowed = ALLOWED_TRANSITIONS.get(
        current_status,
        set(),
    )

    if new_status not in allowed:

        raise InvalidVerificationTransition(
            f"Cannot transition verification "
            f"from {current_status} "
            f"to {new_status}."
        )