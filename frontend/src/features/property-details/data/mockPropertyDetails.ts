import { propertyImages } from '@/assets/propertyImages'
import { mockProperties } from '@/data/mockProperties'
import type {
  DocumentAccessState,
  DocumentReviewStatus,
  PropertyDetails,
  PropertyDocumentSummary,
  PropertyHistoryEvent,
  PropertyImage,
  PropertyListing,
  VerificationCheck,
  VerificationFinding,
  VerificationTimelineStep,
  VerificationWorkflowStatus,
} from '@/types/property'

const galleryImages = [
  propertyImages.modernDuplex,
  propertyImages.apartmentBuilding,
  propertyImages.apartmentInterior,
  propertyImages.commercialOffice,
  propertyImages.coastalLand,
]

function buildImages(property: PropertyListing): PropertyImage[] {
  return galleryImages.map((url, index) => ({
    alt:
      index === 0
        ? `${property.title} exterior in ${property.location}`
        : `${property.title} supporting photo ${index + 1}`,
    id: `${property.id}-image-${index + 1}`,
    isPrimary: index === 0,
    url: index === 0 ? property.image : url,
  }))
}

function buildVerificationTimeline(
  status: VerificationWorkflowStatus,
): VerificationTimelineStep[] {
  const isRejected = status === 'rejected'
  const isApproved = status === 'approved'

  return [
    {
      date: '2026-08-12',
      label: 'Requested',
      state: 'completed',
      status: 'requested',
    },
    {
      date: '2026-08-13',
      label: 'Assigned',
      state: 'completed',
      status: 'assigned',
    },
    {
      date: '2026-08-14',
      label: 'In Progress',
      state: isApproved || isRejected ? 'completed' : 'active',
      status: 'in_progress',
    },
    {
      date: isApproved || isRejected ? '2026-08-17' : undefined,
      label: 'Submitted',
      state: isApproved || isRejected ? 'completed' : 'pending',
      status: 'submitted',
    },
    {
      date: isApproved ? '2026-08-18' : isRejected ? '2026-08-18' : undefined,
      label: 'Decision',
      state: isRejected ? 'failed' : isApproved ? 'completed' : 'pending',
      status,
    },
  ]
}

function buildChecks(status: VerificationWorkflowStatus): VerificationCheck[] {
  const isApproved = status === 'approved'

  return [
    {
      id: 'identity-verification',
      label: 'Identity Verification',
      status: 'completed',
    },
    {
      id: 'documents-review',
      label: 'Property Documents Review',
      status: isApproved ? 'pass' : 'in_progress',
    },
    {
      id: 'details-review',
      label: 'Property Details Review',
      status: isApproved ? 'pass' : 'in_progress',
    },
    {
      id: 'physical-inspection',
      label: 'Physical Inspection',
      status: isApproved ? 'completed' : 'pending',
    },
    {
      id: 'legal-review',
      label: 'Legal Review',
      status: isApproved ? 'pass' : 'pending',
    },
    {
      id: 'final-assessment',
      label: 'Final Assessment',
      status: isApproved ? 'completed' : 'pending',
    },
  ]
}

function buildDocuments(property: PropertyListing): PropertyDocumentSummary[] {
  const baseStatus: DocumentReviewStatus = property.verified
    ? 'accepted'
    : 'under_review'
  const baseAccess: DocumentAccessState = property.verified
    ? 'authorized_due_diligence'
    : 'login_required'

  return [
    {
      access: baseAccess,
      id: `${property.id}-doc-title`,
      issueDate: '2024-04-16',
      reviewStatus: baseStatus,
      source: 'User supplied',
      title: 'Title Document',
      type: 'Ownership record',
    },
    {
      access: 'authorized_due_diligence',
      id: `${property.id}-doc-survey`,
      issueDate: '2025-11-02',
      reviewStatus: property.propertyType === 'land' ? 'accepted' : 'under_review',
      source: 'Authority obtained',
      title: 'Survey Document',
      type: 'Survey information',
    },
    {
      access: 'restricted',
      expiryDate: '2027-01-31',
      id: `${property.id}-doc-tax`,
      issueDate: '2026-01-31',
      reviewStatus: 'accepted',
      source: 'User supplied',
      title: 'Tax Clearance Summary',
      type: 'Tax document',
    },
  ]
}

function buildHistory(property: PropertyListing): PropertyHistoryEvent[] {
  return [
    {
      date: '2026-08-10',
      description: 'A property record was opened for structured marketplace review.',
      event: 'Property record created',
      id: `${property.id}-history-record`,
    },
    {
      date: '2026-08-11',
      description: 'The seller submitted listing information for OWERU review.',
      event: 'Listing created',
      id: `${property.id}-history-listing`,
    },
    {
      date: '2026-08-12',
      description: 'Supporting property documents were added to the record.',
      event: 'Document submitted',
      id: `${property.id}-history-document`,
    },
    {
      date: '2026-08-12',
      description: 'The property was submitted for OWERU verification review.',
      event: 'Verification requested',
      id: `${property.id}-history-requested`,
    },
    {
      date: property.verified ? '2026-08-18' : '2026-08-16',
      description: property.verified
        ? 'Verification information was recorded and approved for publication.'
        : 'Verification review remained in progress while supporting checks continued.',
      event: property.verified ? 'Verification completed' : 'Verification in progress',
      id: `${property.id}-history-verification`,
    },
    {
      date: property.listedOn,
      description: 'The listing was published to the OWERU Marketplace.',
      event: 'Listing published',
      id: `${property.id}-history-published`,
    },
  ]
}

function buildFindings(property: PropertyListing): VerificationFinding[] {
  if (!property.verified) {
    return [
      {
        description:
          'Verification is still being reviewed. Buyers should wait for updated status before relying on this record.',
        id: `${property.id}-finding-review`,
        severity: 'informational',
        title: 'Verification review in progress',
      },
    ]
  }

  return [
    {
      description:
        'Submitted property information is consistent with the reviewed listing record.',
      id: `${property.id}-finding-info`,
      severity: 'informational',
      title: 'Listing information reviewed',
    },
    {
      description:
        'No critical blockers were recorded in the current OWERU verification summary.',
      id: `${property.id}-finding-low`,
      severity: 'low',
      title: 'No critical verification blocker recorded',
    },
  ]
}

function buildPropertyDetails(property: PropertyListing): PropertyDetails {
  const verificationStatus: VerificationWorkflowStatus = property.verified
    ? 'approved'
    : 'in_progress'

  const isLand =
    property.propertyType === 'land' || property.propertyType === 'agricultural'

  return {
    ...property,
    description: isLand
      ? 'A well-positioned property opportunity with practical access, clear location context, and supporting review information prepared for marketplace discovery.'
      : 'A modern residence with spacious interiors, contemporary finishes, secure parking, and convenient access to nearby services. The listing is structured to help buyers review property information, verification status, and next steps with more confidence.',
    detailItems: [
      { label: 'Property Type', value: property.propertyType },
      { label: 'Transaction Type', value: property.transactionType },
      { label: 'Current Status', value: property.status },
      { label: isLand ? 'Plot Size' : 'Area', value: `${property.area} sqm` },
      ...(property.bedrooms
        ? [{ label: 'Bedrooms', value: String(property.bedrooms) }]
        : []),
      ...(property.bathrooms
        ? [{ label: 'Bathrooms', value: String(property.bathrooms) }]
        : []),
      ...(isLand
        ? [
            { label: 'Land Use', value: 'Residential development' },
            { label: 'Access', value: 'Road access available' },
          ]
        : [
            { label: 'Furnishing', value: 'Semi furnished' },
            { label: 'Parking', value: 'Secure parking' },
            { label: 'Year Built', value: '2023' },
          ]),
      { label: 'Property Reference', value: property.id.toUpperCase() },
    ],
    documents: buildDocuments(property),
    features: [
      'En-suite bedrooms',
      'Fitted kitchen',
      'Secure parking',
      'Balcony',
      'Backup water',
      'Security',
      'Garden',
      'Air conditioning',
    ].map((label) => ({
      id: `${property.id}-feature-${label.toLowerCase().replace(/\s+/g, '-')}`,
      label,
    })),
    history: buildHistory(property),
    images: buildImages(property),
    locationInfo: {
      area: property.location.split(',')[0] ?? property.location,
      city: property.location.split(',').at(-1)?.trim() ?? 'Tanzania',
      coordinates: {
        latitude: -6.7615,
        longitude: 39.2326,
      },
      district: property.location.includes('Arusha')
        ? 'Arusha Urban'
        : property.location.includes('Dodoma')
          ? 'Dodoma Urban'
          : 'Kinondoni',
      note: 'Map location is provided for property discovery and should not be interpreted as legal boundary evidence.',
    },
    verification: {
      assignedVerifier: property.verified
        ? 'OWERU Verification Team'
        : 'Assigned verification professional',
      checks: buildChecks(verificationStatus),
      decisionDate: property.verified ? '2026-08-18' : undefined,
      evidence: [
        {
          id: `${property.id}-evidence-title`,
          recordedDate: '2026-08-13',
          relevance:
            'Used to compare submitted ownership information with the property record.',
          sourceType: 'Ownership record',
          title: 'Ownership Document Sighted',
        },
        {
          id: `${property.id}-evidence-authority`,
          recordedDate: '2026-08-14',
          relevance:
            'Referenced during review of submitted property information.',
          sourceType: 'Authority record',
          title: 'Authority Record',
        },
        {
          id: `${property.id}-evidence-inspection`,
          recordedDate: '2026-08-16',
          relevance:
            'Supports the physical condition and location review process.',
          sourceType: 'Inspection evidence',
          title: 'Inspection Photograph',
        },
        {
          id: `${property.id}-evidence-survey`,
          recordedDate: '2026-08-17',
          relevance:
            'Provides supporting context for land and site information.',
          sourceType: 'Survey information',
          title: 'Survey Information',
        },
      ],
      expiryDate: property.verified ? '2027-08-18' : undefined,
      findings: buildFindings(property),
      id: `VER-2026-${property.id.slice(-6).toUpperCase()}`,
      performedBy: property.verified
        ? 'OWERU Verification Team'
        : 'OWERU Verification Desk',
      requestedDate: '2026-08-12',
      startedDate: '2026-08-14',
      status: verificationStatus,
      submittedDate: property.verified ? '2026-08-17' : undefined,
      summaryNote:
        'Verification information is based on the recorded OWERU verification process and supporting evidence.',
      timeline: buildVerificationTimeline(verificationStatus),
      verifiedOn: property.verified ? '2026-08-18' : undefined,
    },
  }
}

const propertyDetails = mockProperties.map(buildPropertyDetails)

export function getMockPropertyDetail(propertyId: string) {
  return propertyDetails.find((property) => property.id === propertyId)
}

export function getMockSimilarProperties(propertyId: string) {
  const property = getMockPropertyDetail(propertyId)

  return mockProperties
    .filter((item) => item.id !== propertyId)
    .filter((item) =>
      property
        ? item.propertyType === property.propertyType ||
          item.transactionType === property.transactionType
        : true,
    )
    .slice(0, 4)
}
