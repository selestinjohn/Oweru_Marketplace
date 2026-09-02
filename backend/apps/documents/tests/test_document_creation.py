import pytest

from apps.documents.models import (
    Document,
    DocumentStatus,
)
from apps.identity.models import User
from apps.parties.models import (

    Party,

    PartyRole,

    PartyType,

    Role,


)


from django.core.files.storage import (
    default_storage,
)
from django.core.files.uploadedfile import (
    SimpleUploadedFile,
)


from apps.identity.models import User
from apps.properties.models import (
    Property,
    PropertyParty,
    PropertyPartyRole,
    PropertyType,
    SourceType,
)
from django.core.files.storage import default_storage
from django.core.files.uploadedfile import (
    SimpleUploadedFile,
)

@pytest.mark.django_db
def test_property_owner_can_create_document(
    api_client,
):

    user = User.objects.create_user(
        email="owner@example.com",
        password="StrongPassword123!",
    )

    party = Party.objects.create(
        user=user,
        party_type=PartyType.PERSON,
        display_name="Property Owner",
    )

    seller_role = Role.objects.get(
        code="SELLER",
    )

    PartyRole.objects.create(
        party=party,
        role=seller_role,
    )

    property = Property.objects.create(
        reference_number="OWERU-DOC-001",
        property_type=PropertyType.LAND,
    )

    PropertyParty.objects.create(
        property=property,
        party=party,
        relationship=PropertyPartyRole.OWNER,
        source_type=SourceType.USER_SUPPLIED,
        started_at="2026-08-28T10:00:00Z",
    )

    api_client.force_authenticate(
        user=user,
    )

    response = api_client.post(
        "/api/v1/documents/",
        {
            "property": str(property.id),
            "document_type": "TITLE",
            "source_type": "USER_SUPPLIED",
            "file_reference": "title-document-001",
            "description": "Property title document",
        },
        format="json",
    )

    assert response.status_code == 201

    document = Document.objects.get(
        property=property,
    )

    assert (
        document.status
        == DocumentStatus.SUBMITTED
    )

    assert (
        document.uploaded_by
        == user
    )




@pytest.mark.django_db
def test_unrelated_user_cannot_create_document(
    api_client,
):
    owner = User.objects.create_user(
        email="owner2@example.com",
        password="StrongPassword123!",
    )
    owner_party = Party.objects.create(
        user=owner,
        party_type=PartyType.PERSON,
        display_name="Property Owner",
    )
    stranger = User.objects.create_user(
        email="stranger@example.com",
        password="StrongPassword123!",
    )
    stranger_party = Party.objects.create(
        user=stranger,
        party_type=PartyType.PERSON,
        display_name="Stranger",
    )
    seller_role = Role.objects.get(
        code="SELLER",
    )
    PartyRole.objects.create(
        party=owner_party,
        role=seller_role,
    )
    PartyRole.objects.create(
        party=stranger_party,
        role=seller_role,
    )
    property = Property.objects.create(
        reference_number="OWERU-DOC-002",
        property_type=PropertyType.LAND,
    )
    PropertyParty.objects.create(
        property=property,
        party=owner_party,
        relationship=PropertyPartyRole.OWNER,
        source_type=SourceType.USER_SUPPLIED,
        started_at="2026-08-28T10:00:00Z",
    )
    api_client.force_authenticate(
        user=stranger,
    )
    response = api_client.post(
        "/api/v1/documents/",
        {
            "property": str(property.id),
            "document_type": "TITLE",
            "source_type": "USER_SUPPLIED",
            "file_reference": "unauthorized-file",
        },
        format="json",
    )
    assert response.status_code == 403






def test_owner_can_upload_document(
    api_client,
    owner_user,
    owner_property,
):

    api_client.force_authenticate(
        user=owner_user,
    )

    uploaded_file = SimpleUploadedFile(
        "title.pdf",
        b"%PDF-1.4 test document",
        content_type="application/pdf",
    )

    response = api_client.post(
        "/api/v1/documents/",
        {
            "property": str(
                owner_property.id
            ),
            "document_type": "TITLE",
            "source_type": "USER_SUPPLIED",
            "file": uploaded_file,
            "description": "Property title document",
        },
        format="multipart",
    )

    assert response.status_code == 201

    document = Document.objects.get(
        property=owner_property,
    )

    assert document.uploaded_by == owner_user

    assert document.status == (
        DocumentStatus.SUBMITTED
    )

    assert document.file_reference

    assert default_storage.exists(
        document.file_reference
    )



def test_uploaded_file_is_stored(
    api_client,
    owner_user,
    owner_property,
):

    api_client.force_authenticate(
        user=owner_user,
    )

    uploaded_file = SimpleUploadedFile(
        "ownership.pdf",
        b"%PDF-1.4 ownership document",
        content_type="application/pdf",
    )

    response = api_client.post(
        "/api/v1/documents/",
        {
            "property": str(
                owner_property.id
            ),
            "document_type": "OWNERSHIP",
            "source_type": "USER_SUPPLIED",
            "file": uploaded_file,
        },
        format="multipart",
    )

    assert response.status_code == 201

    document = Document.objects.get(
        property=owner_property,
    )

    assert default_storage.exists(
        document.file_reference
    )



def test_invalid_file_extension_is_rejected(
    api_client,
    owner_user,
    owner_property,
):

    api_client.force_authenticate(
        user=owner_user,
    )

    uploaded_file = SimpleUploadedFile(
        "malicious.exe",
        b"fake executable",
        content_type="application/octet-stream",
    )

    response = api_client.post(
        "/api/v1/documents/",
        {
            "property": str(
                owner_property.id
            ),
            "document_type": "TITLE",
            "source_type": "USER_SUPPLIED",
            "file": uploaded_file,
        },
        format="multipart",
    )

    assert response.status_code == 400

    assert not Document.objects.filter(
        property=owner_property,
    ).exists()




def test_oversized_file_is_rejected(
    api_client,
    owner_user,
    owner_property,
):

    api_client.force_authenticate(
        user=owner_user,
    )

    uploaded_file = SimpleUploadedFile(
        "large.pdf",
        b"x" * (
            10 * 1024 * 1024 + 1
        ),
        content_type="application/pdf",
    )

    response = api_client.post(
        "/api/v1/documents/",
        {
            "property": str(
                owner_property.id
            ),
            "document_type": "TITLE",
            "source_type": "USER_SUPPLIED",
            "file": uploaded_file,
        },
        format="multipart",
    )

    assert response.status_code == 400

    assert not Document.objects.filter(
        property=owner_property,
    ).exists()



def test_unrelated_user_cannot_upload_document(
    api_client,
    another_user,
    owner_property,
):

    api_client.force_authenticate(
        user=another_user,
    )

    uploaded_file = SimpleUploadedFile(
        "unauthorized.pdf",
        b"%PDF-1.4 unauthorized",
        content_type="application/pdf",
    )

    response = api_client.post(
        "/api/v1/documents/",
        {
            "property": str(
                owner_property.id
            ),
            "document_type": "TITLE",
            "source_type": "USER_SUPPLIED",
            "file": uploaded_file,
        },
        format="multipart",
    )

    assert response.status_code == 403

    assert not Document.objects.filter(
        property=owner_property,
    ).exists()




def test_unrelated_user_cannot_upload_document(
    api_client,
    another_user,
    owner_property,
):

    api_client.force_authenticate(
        user=another_user,
    )

    uploaded_file = SimpleUploadedFile(
        "unauthorized.pdf",
        b"%PDF-1.4 unauthorized",
        content_type="application/pdf",
    )

    response = api_client.post(
        "/api/v1/documents/",
        {
            "property": str(
                owner_property.id
            ),
            "document_type": "TITLE",
            "source_type": "USER_SUPPLIED",
            "file": uploaded_file,
        },
        format="multipart",
    )

    assert response.status_code == 403

    assert not Document.objects.filter(
        property=owner_property,
    ).exists()




@pytest.fixture
def buyer_user(db):

    user = User.objects.create_user(
        email="buyer@example.com",
        password="StrongPassword123!",
    )

    party = Party.objects.create(
        user=user,
        party_type=PartyType.PERSON,
        display_name="Buyer User",
    )

    role = Role.objects.get(
        code="BUYER"
    )

    PartyRole.objects.create(
        party=party,
        role=role,
    )

    return user



def test_buyer_cannot_upload_document_for_unrelated_property(
    api_client,
    buyer_user,
    owner_property,
):

    api_client.force_authenticate(
        user=buyer_user,
    )

    uploaded_file = SimpleUploadedFile(
        "buyer-document.pdf",
        b"%PDF-1.4 buyer document",
        content_type="application/pdf",
    )

    response = api_client.post(
        "/api/v1/documents/",
        {
            "property": str(
                owner_property.id
            ),
            "document_type": "TITLE",
            "source_type": "USER_SUPPLIED",
            "file": uploaded_file,
        },
        format="multipart",
    )

    assert response.status_code == 403



def test_anonymous_user_cannot_upload_document(
    api_client,
    owner_property,
):

    uploaded_file = SimpleUploadedFile(
        "anonymous.pdf",
        b"%PDF-1.4 anonymous",
        content_type="application/pdf",
    )

    response = api_client.post(
        "/api/v1/documents/",
        {
            "property": str(
                owner_property.id
            ),
            "document_type": "TITLE",
            "source_type": "USER_SUPPLIED",
            "file": uploaded_file,
        },
        format="multipart",
    )

    assert response.status_code == 401

    assert not Document.objects.filter(
        property=owner_property,
    ).exists()



def test_client_cannot_set_document_status(
    api_client,
    owner_user,
    owner_property,
):

    api_client.force_authenticate(
        user=owner_user,
    )

    uploaded_file = SimpleUploadedFile(
        "title.pdf",
        b"%PDF-1.4 title document",
        content_type="application/pdf",
    )

    response = api_client.post(
        "/api/v1/documents/",
        {
            "property": str(
                owner_property.id
            ),
            "document_type": "TITLE",
            "source_type": "USER_SUPPLIED",
            "file": uploaded_file,
            "status": "ACCEPTED",
        },
        format="multipart",
    )

    assert response.status_code == 201

    document = Document.objects.get(
        property=owner_property,
    )

    assert document.status == (
        DocumentStatus.SUBMITTED
    )



def test_document_file_is_required(
    api_client,
    owner_user,
    owner_property,
):

    api_client.force_authenticate(
        user=owner_user,
    )

    response = api_client.post(
        "/api/v1/documents/",
        {
            "property": str(
                owner_property.id
            ),
            "document_type": "TITLE",
            "source_type": "USER_SUPPLIED",
        },
        format="multipart",
    )

    assert response.status_code == 400

    assert not Document.objects.filter(
        property=owner_property,
    ).exists()






@pytest.mark.parametrize(
    "filename,content_type",
    [
        ("document.pdf", "application/pdf"),
        ("document.jpg", "image/jpeg"),
        ("document.jpeg", "image/jpeg"),
        ("document.png", "image/png"),
    ],
)
def test_supported_document_types_are_accepted(
    api_client,
    owner_user,
    owner_property,
    filename,
    content_type,
):

    api_client.force_authenticate(
        user=owner_user,
    )

    uploaded_file = SimpleUploadedFile(
        filename,
        b"test document content",
        content_type=content_type,
    )

    response = api_client.post(
        "/api/v1/documents/",
        {
            "property": str(
                owner_property.id
            ),
            "document_type": "OTHER",
            "source_type": "USER_SUPPLIED",
            "file": uploaded_file,
        },
        format="multipart",
    )

    assert response.status_code == 201




@pytest.mark.django_db
def test_authorized_owner_can_download_document(
    api_client,
    owner_user,
    owner_property,
):

    api_client.force_authenticate(
        user=owner_user,
    )

    uploaded_file = SimpleUploadedFile(
        "title.pdf",
        b"%PDF-1.4 test document",
        content_type="application/pdf",
    )

    create_response = api_client.post(
        "/api/v1/documents/",
        {
            "property": str(
                owner_property.id
            ),
            "document_type": "TITLE",
            "source_type": "USER_SUPPLIED",
            "file": uploaded_file,
        },
        format="multipart",
    )

    assert (
        create_response.status_code == 201
    )

    document = Document.objects.get(
        property=owner_property,
    )

    response = api_client.get(
        f"/api/v1/documents/"
        f"{document.id}/download/"
    )

    assert response.status_code == 200



    assert (
        response["Content-Type"]
        == "application/pdf"
    )

    assert (
        "attachment"
        in response["Content-Disposition"]
    )


    content = b"".join(
        response.streaming_content
    )

    assert content == (
        b"%PDF-1.4 test document"
    )



@pytest.mark.django_db
def test_unrelated_user_cannot_download_document(
    api_client,
    owner_user,
    another_user,
    owner_property,
):

    api_client.force_authenticate(
        user=owner_user,
    )

    uploaded_file = SimpleUploadedFile(
        "title.pdf",
        b"%PDF-1.4 private document",
        content_type="application/pdf",
    )

    create_response = api_client.post(
        "/api/v1/documents/",
        {
            "property": str(
                owner_property.id
            ),
            "document_type": "TITLE",
            "source_type": "USER_SUPPLIED",
            "file": uploaded_file,
        },
        format="multipart",
    )

    assert (
        create_response.status_code == 201
    )

    document = Document.objects.get(
        property=owner_property,
    )

    api_client.force_authenticate(
        user=another_user,
    )

    response = api_client.get(
        f"/api/v1/documents/"
        f"{document.id}/download/"
    )

    assert response.status_code == 403




@pytest.mark.django_db
def test_anonymous_user_cannot_download_document(
    api_client,
    owner_user,
    owner_property,
):

    api_client.force_authenticate(
        user=owner_user,
    )

    uploaded_file = SimpleUploadedFile(
        "title.pdf",
        b"%PDF-1.4 private document",
        content_type="application/pdf",
    )

    create_response = api_client.post(
        "/api/v1/documents/",
        {
            "property": str(
                owner_property.id
            ),
            "document_type": "TITLE",
            "source_type": "USER_SUPPLIED",
            "file": uploaded_file,
        },
        format="multipart",
    )

    assert (
        create_response.status_code == 201
    )

    document = Document.objects.get(
        property=owner_property,
    )

    api_client.force_authenticate(
        user=None,
    )

    response = api_client.get(
        f"/api/v1/documents/"
        f"{document.id}/download/"
    )

    assert response.status_code == 401



@pytest.mark.django_db
def test_nonexistent_document_returns_404(
    api_client,
    owner_user,
):

    api_client.force_authenticate(
        user=owner_user,
    )

    response = api_client.get(
        "/api/v1/documents/"
        "00000000-0000-0000-0000-000000000000/"
        "download/"
    )

    assert response.status_code == 404



@pytest.mark.django_db
def test_missing_document_file_returns_404(
    api_client,
    owner_user,
    owner_property,
):

    api_client.force_authenticate(
        user=owner_user,
    )

    uploaded_file = SimpleUploadedFile(
        "title.pdf",
        b"%PDF-1.4 private document",
        content_type="application/pdf",
    )

    create_response = api_client.post(
        "/api/v1/documents/",
        {
            "property": str(
                owner_property.id
            ),
            "document_type": "TITLE",
            "source_type": "USER_SUPPLIED",
            "file": uploaded_file,
        },
        format="multipart",
    )

    assert (
        create_response.status_code == 201
    )

    document = Document.objects.get(
        property=owner_property,
    )

    default_storage.delete(
        document.file_reference
    )

    response = api_client.get(
        f"/api/v1/documents/"
        f"{document.id}/download/"
    )

    assert response.status_code == 404


@pytest.mark.django_db
def test_document_response_does_not_expose_storage_reference(
    api_client,
    owner_user,
    owner_property,
):

    api_client.force_authenticate(
        user=owner_user,
    )

    uploaded_file = SimpleUploadedFile(
        "title.pdf",
        b"%PDF-1.4 private document",
        content_type="application/pdf",
    )

    response = api_client.post(
        "/api/v1/documents/",
        {
            "property": str(
                owner_property.id
            ),
            "document_type": "TITLE",
            "source_type": "USER_SUPPLIED",
            "file": uploaded_file,
        },
        format="multipart",
    )

    assert response.status_code == 201

    assert (
        "file_reference"
        not in response.data
    )


@pytest.mark.django_db
def test_authorized_owner_can_view_document_metadata(
    api_client,
    owner_user,
    owner_property,
):

    api_client.force_authenticate(
        user=owner_user,
    )

    uploaded_file = SimpleUploadedFile(
        "title.pdf",
        b"%PDF-1.4 metadata document",
        content_type="application/pdf",
    )

    create_response = api_client.post(
        "/api/v1/documents/",
        {
            "property": str(
                owner_property.id
            ),
            "document_type": "TITLE",
            "source_type": "USER_SUPPLIED",
            "file": uploaded_file,
        },
        format="multipart",
    )

    assert create_response.status_code == 201

    document = Document.objects.get(
        property=owner_property,
    )

    response = api_client.get(
        f"/api/v1/documents/"
        f"{document.id}/"
    )

    assert response.status_code == 200

    assert response.data["id"] == str(
        document.id
    )

    assert response.data[
        "document_type"
    ] == "TITLE"

    assert (
        "file_reference"
        not in response.data
    )


@pytest.mark.django_db
def test_unrelated_user_cannot_view_document_metadata(
    api_client,
    owner_user,
    another_user,
    owner_property,
):

    api_client.force_authenticate(
        user=owner_user,
    )

    uploaded_file = SimpleUploadedFile(
        "title.pdf",
        b"%PDF-1.4 private metadata",
        content_type="application/pdf",
    )

    create_response = api_client.post(
        "/api/v1/documents/",
        {
            "property": str(
                owner_property.id
            ),
            "document_type": "TITLE",
            "source_type": "USER_SUPPLIED",
            "file": uploaded_file,
        },
        format="multipart",
    )

    assert create_response.status_code == 201

    document = Document.objects.get(
        property=owner_property,
    )

    api_client.force_authenticate(
        user=another_user,
    )

    response = api_client.get(
        f"/api/v1/documents/"
        f"{document.id}/"
    )

    assert response.status_code == 403