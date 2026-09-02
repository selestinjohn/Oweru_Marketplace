from pathlib import Path
from uuid import uuid4

from django.core.files.storage import (
    default_storage,
)


ALLOWED_CONTENT_TYPES = {
    ".pdf": "application/pdf",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
}


def generate_document_path(
    instance,
    filename,
):
    extension = Path(
        filename
    ).suffix.lower()

    return (
        f"documents/properties/"
        f"{uuid4().hex}"
        f"{extension}"
    )


def get_document_content_type(
    file_reference,
):
    extension = Path(
        file_reference
    ).suffix.lower()

    return ALLOWED_CONTENT_TYPES.get(
        extension,
        "application/octet-stream",
    )


def document_exists(
    file_reference,
):
    return default_storage.exists(
        file_reference
    )


def open_document(
    file_reference,
):
    return default_storage.open(
        file_reference,
        "rb",
    )
