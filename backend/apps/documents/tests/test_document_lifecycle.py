import pytest

from apps.documents.models import (
    Document,
    DocumentReview,
    DocumentStatus,
)
from apps.documents.services import DocumentReviewService


@pytest.mark.django_db
def test_document_can_enter_review(
    reviewer_user,
    document,
):
    result = (
        DocumentReviewService.change_status(
            party=reviewer_user.party,
            document=document,
            new_status=(
                DocumentStatus.UNDER_REVIEW
            ),
        )
    )

    assert result.status == (
        DocumentStatus.UNDER_REVIEW
    )

    assert DocumentReview.objects.filter(
        document=document,
    ).count() == 1



@pytest.mark.django_db
def test_document_can_be_accepted(
    reviewer_user,
    document,
):
    DocumentReviewService.change_status(
        party=reviewer_user.party,
        document=document,
        new_status=(
            DocumentStatus.UNDER_REVIEW
        ),
    )

    result = (
        DocumentReviewService.change_status(
            party=reviewer_user.party,
            document=document,
            new_status=(
                DocumentStatus.ACCEPTED
            ),
        )
    )

    assert result.status == (
        DocumentStatus.ACCEPTED
    )




@pytest.mark.django_db
def test_invalid_document_transition_is_rejected(
    reviewer_user,
    document,
):

    from apps.documents.exceptions import (
        InvalidDocumentTransition,
    )

    document.status = (
        DocumentStatus.SUBMITTED
    )

    document.save()

    with pytest.raises(
        InvalidDocumentTransition
    ):

        DocumentReviewService.change_status(
            party=reviewer_user.party,
            document=document,
            new_status=(
                DocumentStatus.ACCEPTED
            ),
        )


@pytest.mark.django_db
def test_document_review_history_is_preserved(
    reviewer_user,
    document,
):

    DocumentReviewService.change_status(
        party=reviewer_user.party,
        document=document,
        new_status=(
            DocumentStatus.UNDER_REVIEW
        ),
    )

    DocumentReviewService.change_status(
        party=reviewer_user.party,
        document=document,
        new_status=(
            DocumentStatus.REJECTED
        ),
        reason="Insufficient evidence.",
    )

    reviews = DocumentReview.objects.filter(
        document=document,
    ).order_by(
        "reviewed_at"
    )

    assert reviews.count() == 2

    assert reviews[0].new_status == (
        DocumentStatus.UNDER_REVIEW
    )

    assert reviews[1].new_status == (
        DocumentStatus.REJECTED
    )

    assert reviews[1].reason == (
        "Insufficient evidence."
    )
