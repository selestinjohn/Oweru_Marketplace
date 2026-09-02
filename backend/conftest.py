import pytest

from rest_framework.test import APIClient

from apps.documents.models import Document
from apps.identity.models import User
from apps.parties.models import Party, PartyRole, PartyType, Role
from apps.properties.models import (
    Property,
    PropertyParty,
    PropertyPartyRole,
    PropertyType,
    SourceType,
)
from apps.verification.models import (
    Verification,
    VerificationDecision,
    VerificationStatus,
)


@pytest.fixture
def api_client():
    return APIClient()


def create_user_with_role(
    *,
    email,
    role_code,
    display_name,
):
    user = User.objects.create_user(
        email=email,
        password="StrongPassword123!",
    )

    party = Party.objects.create(
        user=user,
        party_type=PartyType.PERSON,
        display_name=display_name,
    )

    role = Role.objects.get(
        code=role_code,
    )

    PartyRole.objects.create(
        party=party,
        role=role,
    )

    return user


@pytest.fixture
def admin_user(db):
    return create_user_with_role(
        email="admin@example.com",
        role_code="ADMIN",
        display_name="Admin User",
    )


@pytest.fixture
def reviewer_user(db):
    return create_user_with_role(
        email="reviewer@example.com",
        role_code="ADMIN",
        display_name="Reviewer User",
    )


@pytest.fixture
def requester_user(db):
    return create_user_with_role(
        email="requester@example.com",
        role_code="BUYER",
        display_name="Requester User",
    )


@pytest.fixture
def verifier_user(db):
    return create_user_with_role(
        email="verifier@example.com",
        role_code="VERIFIER",
        display_name="Verifier User",
    )


@pytest.fixture
def another_verifier_user(db):
    return create_user_with_role(
        email="another-verifier@example.com",
        role_code="VERIFIER",
        display_name="Another Verifier",
    )


@pytest.fixture
def owner_user(db):
    return create_user_with_role(
        email="owner-fixture@example.com",
        role_code="SELLER",
        display_name="Owner User",
    )


@pytest.fixture
def owner_property(db, owner_user):
    property = Property.objects.create(
        reference_number="OWERU-PROP-FIX-001",
        property_type=PropertyType.LAND,
    )

    PropertyParty.objects.create(
        property=property,
        party=owner_user.party,
        relationship=PropertyPartyRole.OWNER,
        source_type=SourceType.USER_SUPPLIED,
        started_at="2026-08-28T10:00:00Z",
    )

    return property


@pytest.fixture
def document(db, owner_user, owner_property):
    return Document.objects.create(
        property=owner_property,
        document_type="TITLE",
        source_type=SourceType.USER_SUPPLIED,
        file_reference="test/title.pdf",
        uploaded_by=owner_user,
    )


@pytest.fixture
def verification(db, requester_user, owner_property):
    return Verification.objects.create(
        property=owner_property,
        requested_by=requester_user,
        status=VerificationStatus.REQUESTED,
    )


@pytest.fixture
def assigned_verification(db, verification, verifier_user):
    verification.assigned_verifier = verifier_user
    verification.status = VerificationStatus.ASSIGNED
    verification.save(
        update_fields=[
            "assigned_verifier",
            "status",
            "updated_at",
        ]
    )

    return verification


@pytest.fixture
def in_progress_verification(db, assigned_verification):
    assigned_verification.status = VerificationStatus.IN_PROGRESS
    assigned_verification.save(
        update_fields=[
            "status",
            "updated_at",
        ]
    )

    return assigned_verification


@pytest.fixture
def submitted_verification(db, in_progress_verification):
    in_progress_verification.status = VerificationStatus.SUBMITTED
    in_progress_verification.save(
        update_fields=[
            "status",
            "updated_at",
        ]
    )

    return in_progress_verification


@pytest.fixture
def approved_verification(db, submitted_verification, reviewer_user):
    submitted_verification.status = VerificationStatus.APPROVED
    submitted_verification.save(
        update_fields=[
            "status",
            "updated_at",
        ]
    )

    VerificationDecision.objects.create(
        verification=submitted_verification,
        outcome="APPROVED",
        summary="Verification approved.",
        decided_by=reviewer_user,
    )

    return submitted_verification


@pytest.fixture
def evidence(db, owner_property, verifier_user):
    from apps.documents.models import Evidence

    return Evidence.objects.create(
        property=owner_property,
        source_type=SourceType.USER_SUPPLIED,
        title="Ownership document sighted",
        description="Original document was sighted during inspection.",
        recorded_by=verifier_user,
    )
