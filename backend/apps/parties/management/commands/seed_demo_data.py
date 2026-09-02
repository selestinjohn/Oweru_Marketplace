from decimal import Decimal

from django.core.management import call_command
from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone

from apps.audit.models import AuditCategory, AuditEvent
from apps.disputes.models import (
    Dispute,
    DisputeCategory,
    DisputeMessage,
    DisputePriority,
    DisputeStatus,
)
from apps.documents.models import (
    Document,
    DocumentStatus,
    DocumentType,
    Evidence,
)
from apps.due_diligence.models import (
    DueDiligenceFinding,
    DueDiligenceFindingCategory,
    DueDiligenceFindingSeverity,
    DueDiligenceRequest,
    DueDiligenceStatus,
    RiskOutcome,
    RiskReport,
)
from apps.geospatial.models import (
    BoundaryType,
    GeoRiskSeverity,
    GeoRiskType,
    PropertyBoundary,
    PropertyLocationRecord,
    SiteRisk,
)
from apps.identity.models import AccountStatus, User
from apps.listings.models import (
    Listing,
    ListingParty,
    ListingPartyRelationship,
    ListingStatus,
)
from apps.notifications.models import Notification, NotificationType
from apps.offers.models import (
    Offer,
    OfferEvent,
    OfferEventType,
    OfferStatus,
)
from apps.parties.models import (
    Party,
    PartyRole,
    PartyType,
    Role,
)
from apps.payments.models import (
    Payment,
    PaymentMethod,
    PaymentPurpose,
    PaymentStatus,
    Receipt,
)
from apps.properties.models import (
    Project,
    Property,
    PropertyParty,
    PropertyPartyRole,
    PropertyStatus,
    PropertyType,
    SourceType,
)
from apps.transactions.models import (
    ChecklistItemStatus,
    Transaction,
    TransactionStatus,
    TransferChecklistItem,
)
from apps.transactions.services import DEFAULT_TRANSFER_CHECKLIST


DEMO_PASSWORD = "OweruDemo123!"

DEMO_USERS = {
    "admin": {
        "email": "admin@oweru.test",
        "phone_number": "+255700100001",
        "display_name": "OWERU Admin",
        "role_code": "ADMIN",
    },
    "buyer": {
        "email": "buyer@oweru.test",
        "phone_number": "+255700100002",
        "display_name": "Demo Buyer",
        "role_code": "BUYER",
    },
    "seller": {
        "email": "seller@oweru.test",
        "phone_number": "+255700100003",
        "display_name": "Demo Seller",
        "role_code": "SELLER",
    },
    "verifier": {
        "email": "verifier@oweru.test",
        "phone_number": "+255700100004",
        "display_name": "Demo Site Verifier",
        "role_code": "VERIFIER",
    },
    "professional": {
        "email": "professional@oweru.test",
        "phone_number": "+255700100005",
        "display_name": "Demo Legal Professional",
        "role_code": "PROFESSIONAL",
    },
}


class Command(BaseCommand):

    help = "Create idempotent OWERU demo data for backend/frontend testing."

    def handle(self, *args, **options):
        call_command(
            "seed_rbac",
            verbosity=0,
        )

        with transaction.atomic():
            context = self._seed_demo_graph()

        self.stdout.write(
            self.style.SUCCESS(
                "OWERU demo data successfully seeded."
            )
        )
        self.stdout.write(
            f"Demo password for all users: {DEMO_PASSWORD}"
        )
        self.stdout.write(
            "Demo transaction: "
            f"{context['transaction'].id}"
        )

    def _seed_demo_graph(self):
        now = timezone.now()
        users = {
            key: self._upsert_demo_user(
                **value,
            )
            for key, value in DEMO_USERS.items()
        }

        project, _created = Project.objects.update_or_create(
            name="OWERU Demo Project",
            defaults={
                "description": (
                    "Reference marketplace data for frontend and API testing."
                ),
                "location_description": "Kigamboni, Dar es Salaam",
            },
        )
        property_obj, _created = Property.objects.update_or_create(
            reference_number="OWERU-DEMO-LAND-001",
            defaults={
                "project": project,
                "property_type": PropertyType.LAND,
                "status": PropertyStatus.UNDER_OFFER,
                "ownership_basis": "Demo title deed",
                "description": (
                    "A serviced residential plot prepared for OWERU demo flows."
                ),
                "location_description": "Kigamboni coastal corridor",
                "latitude": Decimal("-6.8503100"),
                "longitude": Decimal("39.3498800"),
            },
        )

        self._ensure_property_relationship(
            property_obj=property_obj,
            party=users["seller"].party,
            relationship=PropertyPartyRole.OWNER,
            now=now,
        )
        self._ensure_property_relationship(
            property_obj=property_obj,
            party=users["seller"].party,
            relationship=PropertyPartyRole.SELLER,
            now=now,
        )

        listing, _created = Listing.objects.update_or_create(
            property=property_obj,
            title="OWERU Demo Kigamboni Plot",
            defaults={
                "description": (
                    "Verified demo listing with active offer and transfer "
                    "operations data."
                ),
                "price": Decimal("85000000.00"),
                "currency": "TZS",
                "status": ListingStatus.PUBLISHED,
                "is_promoted": True,
                "published_at": now,
            },
        )
        ListingParty.objects.update_or_create(
            listing=listing,
            party=users["seller"].party,
            relationship=ListingPartyRelationship.OWNER,
            defaults={
                "is_active": True,
                "ended_at": None,
            },
        )

        offer = self._upsert_offer(
            listing=listing,
            buyer=users["buyer"],
            seller=users["seller"],
            now=now,
        )
        transaction_obj = self._upsert_transaction(
            offer=offer,
            buyer=users["buyer"],
            seller=users["seller"],
            now=now,
        )
        payment = self._upsert_payment(
            transaction_obj=transaction_obj,
            buyer=users["buyer"],
            seller=users["seller"],
            admin=users["admin"],
            now=now,
        )
        document = self._upsert_documentation(
            property_obj=property_obj,
            seller=users["seller"],
            verifier=users["verifier"],
            now=now,
        )
        dispute = self._upsert_dispute(
            transaction_obj=transaction_obj,
            payment=payment,
            buyer=users["buyer"],
            admin=users["admin"],
        )
        self._upsert_geospatial_data(
            property_obj=property_obj,
            verifier=users["verifier"],
            now=now,
        )
        due_diligence = self._upsert_due_diligence(
            property_obj=property_obj,
            transaction_obj=transaction_obj,
            buyer=users["buyer"],
            professional=users["professional"],
            now=now,
        )
        self._upsert_notifications(
            transaction_obj=transaction_obj,
            buyer=users["buyer"],
            seller=users["seller"],
        )
        self._upsert_audit_marker(
            property_obj=property_obj,
            admin=users["admin"],
        )

        return {
            "project": project,
            "property": property_obj,
            "listing": listing,
            "offer": offer,
            "transaction": transaction_obj,
            "payment": payment,
            "document": document,
            "dispute": dispute,
            "due_diligence": due_diligence,
        }

    def _upsert_demo_user(
        self,
        *,
        email,
        phone_number,
        display_name,
        role_code,
    ):
        user, _created = User.objects.get_or_create(
            email=email,
            defaults={
                "phone_number": phone_number,
                "status": AccountStatus.ACTIVE,
                "is_active": True,
            },
        )
        user.phone_number = phone_number
        user.status = AccountStatus.ACTIVE
        user.is_active = True
        user.set_password(
            DEMO_PASSWORD,
        )
        user.save(
            update_fields=[
                "phone_number",
                "status",
                "is_active",
                "password",
            ]
        )

        party, _created = Party.objects.update_or_create(
            user=user,
            defaults={
                "party_type": PartyType.PERSON,
                "display_name": display_name,
            },
        )
        role = Role.objects.get(
            code=role_code,
        )
        PartyRole.objects.update_or_create(
            party=party,
            role=role,
            defaults={
                "is_active": True,
                "expires_at": None,
            },
        )

        return user

    def _ensure_property_relationship(
        self,
        *,
        property_obj,
        party,
        relationship,
        now,
    ):
        property_party, _created = PropertyParty.objects.get_or_create(
            property=property_obj,
            party=party,
            relationship=relationship,
            defaults={
                "basis": "Demo seeded relationship",
                "source_type": SourceType.OWERU_ESTABLISHED,
                "started_at": now,
            },
        )
        property_party.basis = "Demo seeded relationship"
        property_party.source_type = SourceType.OWERU_ESTABLISHED
        property_party.ended_at = None
        property_party.save(
            update_fields=[
                "basis",
                "source_type",
                "ended_at",
                "updated_at",
            ]
        )

    def _upsert_offer(
        self,
        *,
        listing,
        buyer,
        seller,
        now,
    ):
        offer, _created = Offer.objects.get_or_create(
            listing=listing,
            buyer_party=buyer.party,
            created_by=buyer,
            defaults={
                "amount": Decimal("83000000.00"),
                "currency": "TZS",
                "message": "Demo buyer offer for frontend testing.",
                "status": OfferStatus.ACCEPTED,
                "responded_at": now,
                "responded_by": seller,
            },
        )
        offer.amount = Decimal("83000000.00")
        offer.currency = "TZS"
        offer.message = "Demo buyer offer for frontend testing."
        offer.status = OfferStatus.ACCEPTED
        offer.responded_at = now
        offer.responded_by = seller
        offer.withdrawn_at = None
        offer.save(
            update_fields=[
                "amount",
                "currency",
                "message",
                "status",
                "responded_at",
                "responded_by",
                "withdrawn_at",
                "updated_at",
            ]
        )

        OfferEvent.objects.update_or_create(
            offer=offer,
            actor=buyer,
            event_type=OfferEventType.CREATED,
            defaults={
                "amount": offer.amount,
                "currency": offer.currency,
                "message": offer.message,
                "metadata": {
                    "seed": "demo",
                },
            },
        )
        OfferEvent.objects.update_or_create(
            offer=offer,
            actor=seller,
            event_type=OfferEventType.ACCEPTED,
            defaults={
                "message": "Demo seller accepted the offer.",
                "metadata": {
                    "seed": "demo",
                },
            },
        )

        return offer

    def _upsert_transaction(
        self,
        *,
        offer,
        buyer,
        seller,
        now,
    ):
        transaction_obj, _created = Transaction.objects.get_or_create(
            offer=offer,
            defaults={
                "listing": offer.listing,
                "property": offer.listing.property,
                "buyer_party": buyer.party,
                "seller_party": seller.party,
                "agreed_amount": offer.amount,
                "currency": offer.currency,
                "status": TransactionStatus.DOCUMENTATION,
                "initiated_by": seller,
            },
        )
        transaction_obj.listing = offer.listing
        transaction_obj.property = offer.listing.property
        transaction_obj.buyer_party = buyer.party
        transaction_obj.seller_party = seller.party
        transaction_obj.agreed_amount = offer.amount
        transaction_obj.currency = offer.currency
        transaction_obj.status = TransactionStatus.DOCUMENTATION
        transaction_obj.completed_at = None
        transaction_obj.cancelled_at = None
        transaction_obj.save(
            update_fields=[
                "listing",
                "property",
                "buyer_party",
                "seller_party",
                "agreed_amount",
                "currency",
                "status",
                "completed_at",
                "cancelled_at",
                "updated_at",
            ]
        )

        for position, checklist_item in enumerate(
            DEFAULT_TRANSFER_CHECKLIST,
            start=1,
        ):
            item_status = ChecklistItemStatus.PENDING
            completed_at = None
            completed_by = None

            if checklist_item["title"] == "Record payment trail":
                item_status = ChecklistItemStatus.COMPLETED
                completed_at = now
                completed_by = buyer
            elif checklist_item["title"] == "Collect transfer documents":
                item_status = ChecklistItemStatus.IN_PROGRESS

            TransferChecklistItem.objects.update_or_create(
                transaction=transaction_obj,
                title=checklist_item["title"],
                defaults={
                    "description": checklist_item["description"],
                    "responsible_party": (
                        buyer.party
                        if position == 3
                        else seller.party
                    ),
                    "status": item_status,
                    "completed_at": completed_at,
                    "completed_by": completed_by,
                    "position": position,
                },
            )

        return transaction_obj

    def _upsert_payment(
        self,
        *,
        transaction_obj,
        buyer,
        seller,
        admin,
        now,
    ):
        payment, _created = Payment.objects.update_or_create(
            transaction=transaction_obj,
            purpose=PaymentPurpose.RESERVATION_FEE,
            external_reference="DEMO-PAYMENT-001",
            defaults={
                "payer_party": buyer.party,
                "payee_party": seller.party,
                "amount": Decimal("5000000.00"),
                "currency": "TZS",
                "method": PaymentMethod.MOBILE_MONEY,
                "status": PaymentStatus.CONFIRMED,
                "notes": "Demo reservation fee confirmed.",
                "initiated_by": buyer,
                "confirmed_by": admin,
                "confirmed_at": now,
                "failed_at": None,
                "refunded_at": None,
            },
        )
        Receipt.objects.update_or_create(
            payment=payment,
            defaults={
                "receipt_number": "OWERU-RCPT-DEMO-001",
                "issued_to": buyer.party,
                "issued_by": admin,
                "notes": "Demo receipt for confirmed reservation fee.",
            },
        )

        return payment

    def _upsert_documentation(
        self,
        *,
        property_obj,
        seller,
        verifier,
        now,
    ):
        document, _created = Document.objects.update_or_create(
            property=property_obj,
            document_type=DocumentType.TITLE,
            file_reference="demo/oweru-demo-title-deed.pdf",
            defaults={
                "source_type": SourceType.USER_SUPPLIED,
                "status": DocumentStatus.ACCEPTED,
                "description": "Demo title document reference.",
                "sighted_at": now,
                "issued_at": now,
                "expires_at": None,
                "uploaded_by": seller,
            },
        )
        Evidence.objects.update_or_create(
            property=property_obj,
            document=document,
            title="Demo title deed sighted",
            defaults={
                "source_type": SourceType.OWERU_ESTABLISHED,
                "description": (
                    "Demo evidence record for verified title inspection."
                ),
                "recorded_by": verifier,
            },
        )

        return document

    def _upsert_dispute(
        self,
        *,
        transaction_obj,
        payment,
        buyer,
        admin,
    ):
        dispute, _created = Dispute.objects.update_or_create(
            transaction=transaction_obj,
            subject="Demo transfer timeline clarification",
            defaults={
                "payment": payment,
                "listing": transaction_obj.listing,
                "property": transaction_obj.property,
                "opened_by_party": buyer.party,
                "opened_by": buyer,
                "assigned_to": admin,
                "category": DisputeCategory.TRANSACTION,
                "priority": DisputePriority.MEDIUM,
                "status": DisputeStatus.UNDER_REVIEW,
                "description": (
                    "Demo dispute used to test support and operations screens."
                ),
                "resolution_summary": "",
                "resolved_by": None,
                "resolved_at": None,
                "closed_at": None,
            },
        )
        DisputeMessage.objects.update_or_create(
            dispute=dispute,
            author_party=buyer.party,
            message="Please confirm the expected title transfer timeline.",
            defaults={
                "author": buyer,
                "is_internal": False,
            },
        )

        return dispute

    def _upsert_geospatial_data(
        self,
        *,
        property_obj,
        verifier,
        now,
    ):
        PropertyLocationRecord.objects.update_or_create(
            property=property_obj,
            is_primary=True,
            defaults={
                "latitude": Decimal("-6.8503100"),
                "longitude": Decimal("39.3498800"),
                "accuracy_meters": Decimal("4.50"),
                "source_type": SourceType.OWERU_ESTABLISHED,
                "captured_by": verifier,
                "notes": "Demo GPS capture for property inspection.",
            },
        )
        PropertyBoundary.objects.update_or_create(
            property=property_obj,
            boundary_type=BoundaryType.PARCEL,
            is_current=True,
            defaults={
                "source_type": SourceType.OWERU_ESTABLISHED,
                "coordinates": [
                    {
                        "latitude": "-6.8501000",
                        "longitude": "39.3496000",
                    },
                    {
                        "latitude": "-6.8501000",
                        "longitude": "39.3501600",
                    },
                    {
                        "latitude": "-6.8505200",
                        "longitude": "39.3501600",
                    },
                    {
                        "latitude": "-6.8505200",
                        "longitude": "39.3496000",
                    },
                ],
                "centroid_latitude": Decimal("-6.8503100"),
                "centroid_longitude": Decimal("39.3498800"),
                "area_square_meters": Decimal("2400.00"),
                "area_variance_percent": Decimal("1.20"),
                "captured_by": verifier,
                "verified_at": now,
                "notes": "Demo parcel boundary verified against supplied survey.",
            },
        )
        SiteRisk.objects.update_or_create(
            property=property_obj,
            risk_type=GeoRiskType.ACCESS,
            defaults={
                "severity": GeoRiskSeverity.MEDIUM,
                "source_type": SourceType.OWERU_ESTABLISHED,
                "description": (
                    "Access road is visible but should be confirmed before "
                    "completion."
                ),
                "mitigation_notes": (
                    "Confirm access agreement during documentation stage."
                ),
                "recorded_by": verifier,
                "resolved_at": None,
            },
        )

    def _upsert_due_diligence(
        self,
        *,
        property_obj,
        transaction_obj,
        buyer,
        professional,
        now,
    ):
        request, _created = DueDiligenceRequest.objects.update_or_create(
            property=property_obj,
            transaction=transaction_obj,
            requested_by_party=buyer.party,
            defaults={
                "requested_by": buyer,
                "assigned_reviewer": professional,
                "status": DueDiligenceStatus.SUBMITTED,
                "requested_checks": [
                    "title",
                    "party",
                    "geospatial",
                    "payment",
                ],
                "notes": "Demo due diligence request for frontend testing.",
                "started_at": now,
                "submitted_at": now,
                "decided_at": None,
                "decided_by": None,
                "decision_notes": "",
            },
        )
        RiskReport.objects.update_or_create(
            due_diligence_request=request,
            defaults={
                "outcome": RiskOutcome.MEDIUM_RISK,
                "summary": (
                    "Demo report: transaction may proceed once access "
                    "confirmation is documented."
                ),
                "title_summary": "Title record supplied and sighted.",
                "party_summary": "Buyer and seller roles are present.",
                "geospatial_summary": (
                    "Boundary captured with a medium access-road risk."
                ),
                "payment_summary": (
                    "Reservation fee receipt has been issued."
                ),
                "evidence_summary": {
                    "seed": "demo",
                    "document": "demo/oweru-demo-title-deed.pdf",
                },
                "prepared_by": professional,
                "expires_at": None,
            },
        )
        DueDiligenceFinding.objects.update_or_create(
            due_diligence_request=request,
            category=DueDiligenceFindingCategory.GEOSPATIAL,
            title="Access route requires confirmation",
            defaults={
                "severity": DueDiligenceFindingSeverity.MEDIUM,
                "description": (
                    "Demo finding requiring access-road confirmation before "
                    "closing."
                ),
                "recommendation": (
                    "Attach access confirmation before completing transfer."
                ),
                "recorded_by": professional,
            },
        )

        return request

    def _upsert_notifications(
        self,
        *,
        transaction_obj,
        buyer,
        seller,
    ):
        for recipient, title, message in [
            (
                buyer,
                "Demo transaction ready",
                "A demo purchase transaction is ready for review.",
            ),
            (
                seller,
                "Demo listing has an accepted offer",
                "Your demo listing is in the documentation stage.",
            ),
        ]:
            Notification.objects.update_or_create(
                recipient_user=recipient,
                recipient_party=recipient.party,
                title=title,
                resource_type=transaction_obj._meta.label,
                resource_id=str(transaction_obj.id),
                defaults={
                    "notification_type": NotificationType.TRANSACTION,
                    "message": message,
                    "payload": {
                        "seed": "demo",
                        "transaction_id": str(transaction_obj.id),
                    },
                    "read_at": None,
                    "archived_at": None,
                },
            )

    def _upsert_audit_marker(
        self,
        *,
        property_obj,
        admin,
    ):
        AuditEvent.objects.update_or_create(
            action="demo.seeded",
            resource_type=property_obj._meta.label,
            resource_id=str(property_obj.id),
            defaults={
                "actor": admin,
                "category": AuditCategory.SYSTEM,
                "summary": "Demo data seeded for OWERU backend.",
                "after": {
                    "reference_number": property_obj.reference_number,
                },
                "metadata": {
                    "seed": "demo",
                },
            },
        )
