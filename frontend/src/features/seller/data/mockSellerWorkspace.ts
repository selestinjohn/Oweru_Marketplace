import {
  AlertTriangle,
  Building2,
  ClipboardCheck,
  FilePlus2,
  FileText,
  Home,
  ListChecks,
  Megaphone,
  PauseCircle,
  ShieldCheck,
} from 'lucide-react'
import { propertyImages } from '@/assets/propertyImages'
import { routePaths } from '@/constants/routes'
import type {
  SellerActivity,
  SellerAttentionItem,
  SellerListing,
  SellerListingStatus,
  SellerOverview,
  SellerOverviewMetric,
  SellerPropertyBundle,
  SellerPropertyStatus,
  SellerPropertyType,
} from '@/features/seller/types/seller.types'

const sellerPropertyPath = (propertyId: string) =>
  routePaths.sellerPropertyDetail.replace(':propertyId', propertyId)

const sellerPropertyDocumentsPath = (propertyId: string) =>
  routePaths.sellerPropertyDocuments.replace(':propertyId', propertyId)

const sellerListingPath = (listingId: string) =>
  routePaths.sellerListingDetail.replace(':listingId', listingId)

const baseActivity: SellerActivity[] = [
  {
    description:
      'The listing for Modern 4 Bedroom Duplex is live on OWERU Marketplace.',
    href: sellerListingPath('lst-owr-000245'),
    icon: Megaphone,
    id: 'seller-act-001',
    timestamp: 'Today',
    title: 'Listing published',
  },
  {
    description:
      'Survey and ownership document metadata were recorded for Kigamboni Residential Plot.',
    href: sellerPropertyDocumentsPath('prop-owr-000118'),
    icon: FileText,
    id: 'seller-act-002',
    timestamp: 'Yesterday',
    title: 'Documents submitted',
  },
  {
    description:
      'OWERU verification is currently reviewing Commercial Office Record.',
    href: sellerPropertyPath('prop-owr-000401'),
    icon: ClipboardCheck,
    id: 'seller-act-003',
    timestamp: '2 days ago',
    title: 'Verification in progress',
  },
  {
    description:
      'The apartment record was created before a marketplace listing was added.',
    href: sellerPropertyPath('prop-owr-000316'),
    icon: Building2,
    id: 'seller-act-004',
    timestamp: '4 days ago',
    title: 'Property record created',
  },
]

export const mockSellerPropertyBundles: SellerPropertyBundle[] = [
  {
    property: {
      created_at: '2026-08-10T08:30:00+03:00',
      description:
        'A managed property record for a modern four-bedroom residence with spacious interiors, secure parking, and strong marketplace demand.',
      id: 'prop-owr-000245',
      image: propertyImages.modernDuplex,
      latitude: '-6.7448920',
      location_description: 'Masaki, Dar es Salaam',
      longitude: '39.2786410',
      ownership_basis: 'Registered owner with seller authorization on record.',
      project: null,
      property_type: 'HOUSE',
      reference_number: 'P-OWR-2026-000245',
      status: 'AVAILABLE',
      updated_at: '2026-08-29T11:20:00+03:00',
    },
    listing: {
      created_at: '2026-08-12T12:00:00+03:00',
      currency: 'TZS',
      description:
        'Premium family residence with modern finishing, private parking, and easy access to Masaki services.',
      id: 'lst-owr-000245',
      is_promoted: true,
      price: '850000000.00',
      property: 'prop-owr-000245',
      published_at: '2026-08-18T09:00:00+03:00',
      status: 'PUBLISHED',
      title: 'Modern 4 Bedroom Duplex',
      updated_at: '2026-08-29T11:20:00+03:00',
    },
    documents: [
      {
        created_at: '2026-08-12T14:00:00+03:00',
        description: 'Ownership document metadata submitted by the seller.',
        document_type: 'OWNERSHIP',
        expires_at: null,
        id: 'doc-owr-000245-ownership',
        issued_at: '2024-03-12',
        property: 'prop-owr-000245',
        sighted_at: '2026-08-18T08:30:00+03:00',
        source_type: 'USER_SUPPLIED',
        status: 'ACCEPTED',
        updated_at: '2026-08-18T08:30:00+03:00',
        uploaded_by: 'user-seller-001',
      },
      {
        created_at: '2026-08-13T10:15:00+03:00',
        description: 'Tax clearance metadata retained for authorized review.',
        document_type: 'TAX',
        expires_at: '2027-01-31',
        id: 'doc-owr-000245-tax',
        issued_at: '2026-01-31',
        property: 'prop-owr-000245',
        sighted_at: '2026-08-18T08:45:00+03:00',
        source_type: 'USER_SUPPLIED',
        status: 'ACCEPTED',
        updated_at: '2026-08-18T08:45:00+03:00',
        uploaded_by: 'user-seller-001',
      },
    ],
    verification: {
      assigned_at: '2026-08-13T10:00:00+03:00',
      assigned_verifier_name: 'Saad Baraka, OWERU Verifier',
      created_at: '2026-08-12T10:00:00+03:00',
      decided_at: '2026-08-18T15:30:00+03:00',
      expires_at: '2027-08-18T15:30:00+03:00',
      id: 'ver-2026-00129',
      property: 'prop-owr-000245',
      requested_at: '2026-08-12T10:00:00+03:00',
      status: 'APPROVED',
      submitted_at: '2026-08-17T16:20:00+03:00',
      updated_at: '2026-08-18T15:30:00+03:00',
    },
    participants: [
      {
        basis: 'Seller controls listing with owner authorization.',
        ended_at: null,
        id: 'party-rel-000245-owner',
        party_display_name: 'Tolu Adewale',
        relationship: 'OWNER',
        source_type: 'USER_SUPPLIED',
        started_at: '2026-08-10T08:30:00+03:00',
      },
      {
        basis: 'Marketplace management role recorded for OWERU seller account.',
        ended_at: null,
        id: 'party-rel-000245-seller',
        party_display_name: 'North Coast Homes',
        relationship: 'SELLER',
        source_type: 'USER_SUPPLIED',
        started_at: '2026-08-12T12:00:00+03:00',
      },
    ],
    activity: baseActivity.slice(0, 3),
  },
  {
    property: {
      created_at: '2026-08-20T10:10:00+03:00',
      description:
        'A persistent record for a Mbezi Beach apartment. The property record exists, but the marketplace advertisement is still being prepared.',
      id: 'prop-owr-000316',
      image: propertyImages.apartmentBuilding,
      latitude: '-6.7053190',
      location_description: 'Mbezi Beach, Dar es Salaam',
      longitude: '39.2248120',
      ownership_basis: 'Managed property with seller relationship recorded.',
      project: null,
      property_type: 'APARTMENT',
      reference_number: 'P-OWR-2026-000316',
      status: 'DRAFT',
      updated_at: '2026-08-28T09:10:00+03:00',
    },
    listing: {
      created_at: '2026-08-25T10:15:00+03:00',
      currency: 'TZS',
      description:
        'Two-bedroom apartment close to the coastline with parking and managed building services.',
      id: 'lst-owr-000316',
      is_promoted: false,
      price: '2500000.00',
      property: 'prop-owr-000316',
      published_at: null,
      status: 'DRAFT',
      title: '2 Bedroom Apartment',
      updated_at: '2026-08-28T09:10:00+03:00',
    },
    documents: [
      {
        created_at: '2026-08-23T11:40:00+03:00',
        description: 'Identity-related participant support for account review.',
        document_type: 'IDENTITY',
        expires_at: null,
        id: 'doc-owr-000316-identity',
        issued_at: null,
        property: 'prop-owr-000316',
        sighted_at: null,
        source_type: 'USER_SUPPLIED',
        status: 'SUBMITTED',
        updated_at: '2026-08-23T11:40:00+03:00',
        uploaded_by: 'user-seller-001',
      },
    ],
    verification: null,
    participants: [
      {
        basis: 'Seller relationship created with the property record.',
        ended_at: null,
        id: 'party-rel-000316-seller',
        party_display_name: 'North Coast Homes',
        relationship: 'SELLER',
        source_type: 'USER_SUPPLIED',
        started_at: '2026-08-20T10:10:00+03:00',
      },
    ],
    activity: baseActivity.slice(2, 4),
  },
  {
    property: {
      created_at: '2026-08-11T09:20:00+03:00',
      description:
        'A residential plot record in Kigamboni with location context and supporting documents under review.',
      id: 'prop-owr-000118',
      image: propertyImages.coastalLand,
      latitude: '-6.8273400',
      location_description: 'Kigamboni, Dar es Salaam',
      longitude: '39.3104110',
      ownership_basis: 'Claimed ownership supported by submitted survey records.',
      project: null,
      property_type: 'LAND',
      reference_number: 'P-OWR-2026-000118',
      status: 'AVAILABLE',
      updated_at: '2026-08-27T13:10:00+03:00',
    },
    listing: {
      created_at: '2026-08-13T12:15:00+03:00',
      currency: 'TZS',
      description:
        'Residential plot positioned for future development near access roads.',
      id: 'lst-owr-000118',
      is_promoted: false,
      price: '18000000.00',
      property: 'prop-owr-000118',
      published_at: null,
      status: 'PENDING_REVIEW',
      title: 'Premium Residential Plot',
      updated_at: '2026-08-27T13:10:00+03:00',
    },
    documents: [
      {
        created_at: '2026-08-12T16:40:00+03:00',
        description: 'Survey document metadata awaiting review outcome.',
        document_type: 'SURVEY',
        expires_at: null,
        id: 'doc-owr-000118-survey',
        issued_at: '2025-11-02',
        property: 'prop-owr-000118',
        sighted_at: null,
        source_type: 'USER_SUPPLIED',
        status: 'UNDER_REVIEW',
        updated_at: '2026-08-27T13:10:00+03:00',
        uploaded_by: 'user-seller-001',
      },
    ],
    verification: {
      assigned_at: '2026-08-14T08:00:00+03:00',
      assigned_verifier_name: 'Neema Komba, OWERU Verifier',
      created_at: '2026-08-13T09:00:00+03:00',
      decided_at: null,
      expires_at: null,
      id: 'ver-2026-00118',
      property: 'prop-owr-000118',
      requested_at: '2026-08-13T09:00:00+03:00',
      status: 'IN_PROGRESS',
      submitted_at: null,
      updated_at: '2026-08-27T13:10:00+03:00',
    },
    participants: [
      {
        basis: 'Claimant relationship recorded pending supporting review.',
        ended_at: null,
        id: 'party-rel-000118-claimant',
        party_display_name: 'Coastal Growth Corridor',
        relationship: 'CLAIMANT',
        source_type: 'USER_SUPPLIED',
        started_at: '2026-08-11T09:20:00+03:00',
      },
    ],
    activity: baseActivity.slice(1, 3),
  },
  {
    property: {
      created_at: '2026-08-05T08:45:00+03:00',
      description:
        'Commercial property record for office use in Upanga, with verification activity still open.',
      id: 'prop-owr-000401',
      image: propertyImages.commercialOffice,
      latitude: '-6.8099440',
      location_description: 'Upanga, Dar es Salaam',
      longitude: '39.2832050',
      ownership_basis: 'Managed by an authorized commercial property manager.',
      project: { id: 'proj-commercial-dar', name: 'Dar Commercial Portfolio' },
      property_type: 'OFFICE',
      reference_number: 'P-OWR-2026-000401',
      status: 'UNDER_OFFER',
      updated_at: '2026-08-26T16:00:00+03:00',
    },
    listing: {
      created_at: '2026-08-08T15:20:00+03:00',
      currency: 'TZS',
      description:
        'Professional office space in Upanga suitable for teams needing central access.',
      id: 'lst-owr-000401',
      is_promoted: false,
      price: '35000000.00',
      property: 'prop-owr-000401',
      published_at: '2026-08-10T08:00:00+03:00',
      status: 'PAUSED',
      title: 'Commercial Office Space',
      updated_at: '2026-08-26T16:00:00+03:00',
    },
    documents: [],
    verification: {
      assigned_at: null,
      assigned_verifier_name: null,
      created_at: '2026-08-24T09:15:00+03:00',
      decided_at: null,
      expires_at: null,
      id: 'ver-2026-00141',
      property: 'prop-owr-000401',
      requested_at: '2026-08-24T09:15:00+03:00',
      status: 'REQUESTED',
      submitted_at: null,
      updated_at: '2026-08-24T09:15:00+03:00',
    },
    participants: [
      {
        basis: 'Management agreement recorded at property setup.',
        ended_at: null,
        id: 'party-rel-000401-manager',
        party_display_name: 'Oweru Commercial Desk',
        relationship: 'MANAGER',
        source_type: 'USER_SUPPLIED',
        started_at: '2026-08-05T08:45:00+03:00',
      },
    ],
    activity: baseActivity.slice(0, 1),
  },
  {
    property: {
      created_at: '2025-07-22T10:00:00+03:00',
      description:
        'Warehouse facility record used for logistics marketplace visibility in Mwanza.',
      id: 'prop-owr-000099',
      image: propertyImages.warehouseFacility,
      latitude: '-2.5164300',
      location_description: 'Ilemela, Mwanza',
      longitude: '32.9011700',
      ownership_basis: 'Seller relationship recorded with management authority.',
      project: null,
      property_type: 'COMMERCIAL',
      reference_number: 'P-OWR-2025-000099',
      status: 'INACTIVE',
      updated_at: '2026-08-19T14:15:00+03:00',
    },
    listing: null,
    documents: [
      {
        created_at: '2025-07-25T12:30:00+03:00',
        description:
          'Previously accepted ownership support now needs current review.',
        document_type: 'TITLE',
        expires_at: null,
        id: 'doc-owr-000099-title',
        issued_at: '2021-06-01',
        property: 'prop-owr-000099',
        sighted_at: '2025-08-02T10:10:00+03:00',
        source_type: 'USER_SUPPLIED',
        status: 'EXPIRED',
        updated_at: '2026-08-19T14:15:00+03:00',
        uploaded_by: 'user-seller-001',
      },
    ],
    verification: {
      assigned_at: '2025-08-02T10:00:00+03:00',
      assigned_verifier_name: 'Saad Baraka, OWERU Verifier',
      created_at: '2025-08-01T09:00:00+03:00',
      decided_at: '2025-08-10T15:00:00+03:00',
      expires_at: '2026-08-10T15:00:00+03:00',
      id: 'ver-2025-00044',
      property: 'prop-owr-000099',
      requested_at: '2025-08-01T09:00:00+03:00',
      status: 'EXPIRED',
      submitted_at: '2025-08-08T15:00:00+03:00',
      updated_at: '2026-08-10T15:00:00+03:00',
    },
    participants: [
      {
        basis: 'Seller relationship active for record maintenance.',
        ended_at: null,
        id: 'party-rel-000099-seller',
        party_display_name: 'Lake Zone Logistics',
        relationship: 'SELLER',
        source_type: 'USER_SUPPLIED',
        started_at: '2025-07-22T10:00:00+03:00',
      },
    ],
    activity: [
      {
        description:
          'Verification validity expired and the seller record needs a new review.',
        href: sellerPropertyPath('prop-owr-000099'),
        icon: AlertTriangle,
        id: 'seller-act-005',
        timestamp: '19 August 2026',
        title: 'Verification expired',
      },
    ],
  },
]

export const sellerPropertyStatusOptions: Array<{
  label: string
  value: 'all' | SellerPropertyStatus
}> = [
  { label: 'All', value: 'all' },
  { label: 'Draft', value: 'DRAFT' },
  { label: 'Available', value: 'AVAILABLE' },
  { label: 'Under Offer', value: 'UNDER_OFFER' },
  { label: 'Sold', value: 'SOLD' },
  { label: 'Rented', value: 'RENTED' },
  { label: 'Inactive', value: 'INACTIVE' },
]

export const sellerPropertyTypeOptions: Array<{
  label: string
  value: 'all' | SellerPropertyType
}> = [
  { label: 'All Types', value: 'all' },
  { label: 'Land', value: 'LAND' },
  { label: 'House', value: 'HOUSE' },
  { label: 'Apartment', value: 'APARTMENT' },
  { label: 'Commercial', value: 'COMMERCIAL' },
  { label: 'Office', value: 'OFFICE' },
  { label: 'Farm', value: 'FARM' },
  { label: 'Other', value: 'OTHER' },
]

export const sellerListingStatusOptions: Array<{
  label: string
  value: 'all' | SellerListingStatus
}> = [
  { label: 'All', value: 'all' },
  { label: 'Draft', value: 'DRAFT' },
  { label: 'Pending Review', value: 'PENDING_REVIEW' },
  { label: 'Published', value: 'PUBLISHED' },
  { label: 'Paused', value: 'PAUSED' },
  { label: 'Sold', value: 'SOLD' },
  { label: 'Closed', value: 'CLOSED' },
]

export function getMockSellerOverview(): SellerOverview {
  const publishedListings = mockSellerPropertyBundles.filter(
    (bundle) => bundle.listing?.status === 'PUBLISHED',
  ).length
  const pendingReview = mockSellerPropertyBundles.filter(
    (bundle) => bundle.listing?.status === 'PENDING_REVIEW',
  ).length
  const verificationAttention = mockSellerPropertyBundles.filter((bundle) =>
    ['REQUESTED', 'IN_PROGRESS', 'EXPIRED'].includes(
      bundle.verification?.status ?? '',
    ),
  ).length

  const metrics: SellerOverviewMetric[] = [
    {
      context: 'Property records you can manage',
      icon: Home,
      id: 'my-properties',
      label: 'My Properties',
      tone: 'navy',
      value: String(mockSellerPropertyBundles.length),
    },
    {
      context: 'Visible marketplace advertisements',
      icon: Megaphone,
      id: 'published-listings',
      label: 'Published Listings',
      tone: 'success',
      value: String(publishedListings),
    },
    {
      context: 'Listings waiting on review activity',
      icon: PauseCircle,
      id: 'pending-review',
      label: 'Pending Review',
      tone: 'gold',
      value: String(pendingReview),
    },
    {
      context: 'Verification or document follow-up',
      icon: ShieldCheck,
      id: 'verification-attention',
      label: 'Verification Attention',
      tone: 'warning',
      value: String(verificationAttention),
    },
  ]

  const attention: SellerAttentionItem[] = [
    {
      actionHref: sellerPropertyDocumentsPath('prop-owr-000401'),
      actionLabel: 'Add document',
      context: 'Commercial Office Space',
      id: 'attn-docs-000401',
      status: 'Missing supporting documents',
      title: 'Property missing documents',
      tone: 'warning',
    },
    {
      actionHref: sellerListingPath('lst-owr-000316'),
      actionLabel: 'Review listing',
      context: '2 Bedroom Apartment',
      id: 'attn-draft-000316',
      status: 'Listing still in Draft',
      title: 'Draft listing needs completion',
      tone: 'gold',
    },
    {
      actionHref: sellerPropertyPath('prop-owr-000118'),
      actionLabel: 'Track verification',
      context: 'Premium Residential Plot',
      id: 'attn-ver-000118',
      status: 'Verification in progress',
      title: 'Verification awaiting action',
      tone: 'navy',
    },
    {
      actionHref: sellerPropertyPath('prop-owr-000099'),
      actionLabel: 'Review property',
      context: 'Warehouse Facility',
      id: 'attn-expired-000099',
      status: 'Verification expired',
      title: 'Record needs current verification',
      tone: 'warning',
    },
  ]

  return {
    attention,
    metrics,
    recentActivity: baseActivity,
  }
}

export function filterSellerProperties({
  propertyType,
  query,
  status,
}: {
  propertyType: 'all' | SellerPropertyType
  query: string
  status: 'all' | SellerPropertyStatus
}) {
  const normalizedQuery = query.trim().toLowerCase()

  return mockSellerPropertyBundles.filter((bundle) => {
    const property = bundle.property
    const listing = bundle.listing

    return (
      (status === 'all' || property.status === status) &&
      (propertyType === 'all' || property.property_type === propertyType) &&
      (!normalizedQuery ||
        property.reference_number.toLowerCase().includes(normalizedQuery) ||
        property.location_description.toLowerCase().includes(normalizedQuery) ||
        listing?.title.toLowerCase().includes(normalizedQuery))
    )
  })
}

export function filterSellerListings({
  query,
  status,
}: {
  query: string
  status: 'all' | SellerListingStatus
}) {
  const normalizedQuery = query.trim().toLowerCase()

  return mockSellerPropertyBundles
    .filter((bundle) => bundle.listing)
    .filter((bundle) => {
      const listing = bundle.listing as SellerListing
      const property = bundle.property

      return (
        (status === 'all' || listing.status === status) &&
        (!normalizedQuery ||
          listing.title.toLowerCase().includes(normalizedQuery) ||
          property.reference_number.toLowerCase().includes(normalizedQuery) ||
          property.location_description.toLowerCase().includes(normalizedQuery))
      )
    })
}

export function findSellerPropertyBundle(propertyId: string) {
  return mockSellerPropertyBundles.find(
    (bundle) => bundle.property.id === propertyId,
  )
}

export function findSellerListingBundle(listingId: string) {
  return mockSellerPropertyBundles.find(
    (bundle) => bundle.listing?.id === listingId,
  )
}

export function propertyOptionsForListing() {
  return mockSellerPropertyBundles.map((bundle) => ({
    label: `${bundle.property.reference_number} - ${bundle.property.location_description}`,
    value: bundle.property.id,
  }))
}

export function sellerDocumentTypes() {
  return [
    { label: 'Title Document', value: 'TITLE' },
    { label: 'Ownership Document', value: 'OWNERSHIP' },
    { label: 'Tax Document', value: 'TAX' },
    { label: 'Identity Document', value: 'IDENTITY' },
    { label: 'Survey Document', value: 'SURVEY' },
    { label: 'Other Document', value: 'OTHER' },
  ]
}

export function propertySetupItems(bundle: SellerPropertyBundle) {
  return [
    {
      detail: bundle.property.description ? 'Description recorded' : 'Add description',
      label: 'Basic Information',
      state: bundle.property.description ? 'Complete' : 'Needs Attention',
    },
    {
      detail: `${bundle.documents.length} document${
        bundle.documents.length === 1 ? '' : 's'
      } submitted`,
      label: 'Documents',
      state: bundle.documents.length > 0 ? 'Recorded' : 'Needs Documents',
    },
    {
      detail: bundle.listing
        ? `${bundle.listing.title} is ${bundle.listing.status.toLowerCase()}`
        : 'No listing attached',
      label: 'Marketplace Listing',
      state: bundle.listing ? 'Created' : 'Not Created',
    },
    {
      detail: bundle.verification
        ? `Status: ${bundle.verification.status.toLowerCase()}`
        : 'No verification requested',
      label: 'Verification',
      state: bundle.verification ? 'Tracked' : 'Not Requested',
    },
  ]
}
