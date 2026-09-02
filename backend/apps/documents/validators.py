from pathlib import Path

from django.core.exceptions import ValidationError


MAX_DOCUMENT_SIZE = 10 * 1024 * 1024

ALLOWED_EXTENSIONS = {
    ".pdf",
    ".jpg",
    ".jpeg",
    ".png",
}


def validate_document_file(file):
    if not file:
        raise ValidationError(
            "A document file is required."
        )

    if file.size > MAX_DOCUMENT_SIZE:
        raise ValidationError(
            "Document file must not exceed 10 MB."
        )

    extension = Path(
        file.name
    ).suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise ValidationError(
            "Unsupported document file type."
        )

    return file