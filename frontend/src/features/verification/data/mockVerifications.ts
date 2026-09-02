import { mockProperties } from '@/data/mockProperties'
import type {
  EvidenceSourceType,
  FindingSeverity,
  VerificationCheck,
  VerificationCheckStatus,
  VerificationDecision,
  VerificationDetails,
  VerificationEvidence,
  VerificationFinding,
  VerificationStatus,
} from '@/features/verification/types/verification.types'
import type { ID } from '@/types/api'

const demoVerifierId = 'user-verifier-001'
const demoReviewerId = 'user-operations-001'
const demoRequesterId = 'user-buyer-001'

const propertyById = (propertyId: ID) =>
  mockProperties.find((property) => property.id === propertyId) ??
  mockProperties[0]

function isoDate(day: number) {
  return `2026-08-${String(day).padStart(2, '0')}T09:30:00+03:00`
}

function buildChecks(
  verificationId: ID,
  status: VerificationStatus,
): VerificationCheck[] {
  const isComplete = ['APPROVED', 'REJECTED', 'EXPIRED', 'SUBMITTED'].includes(
    status,
  )
  const inProgress = status === 'IN_PROGRESS'

  const items: Array<{
    code: string
    description: string
    findings?: string
    status: VerificationCheckStatus
    title: string
  }> = [
    {
      code: 'IDENTITY_REVIEW',
      description:
        'Confirm the requester and listed participant context recorded against the property.',
      status: isComplete || inProgress ? 'PASS' : 'NOT_STARTED',
      title: 'Identity Review',
    },
    {
      code: 'PROPERTY_DOCUMENTS',
      description:
        'Review submitted property document metadata and authorized evidence summaries.',
      findings: isComplete
        ? 'Document references were reviewed through the OWERU record.'
        : '',
      status: isComplete ? 'PASS' : inProgress ? 'PASS' : 'NOT_STARTED',
      title: 'Property Documents',
    },
    {
      code: 'PROPERTY_DETAILS',
      description:
        'Compare listing description, location, type, and recorded property attributes.',
      status: isComplete ? 'PASS' : inProgress ? 'PASS' : 'NOT_STARTED',
      title: 'Property Details',
    },
    {
      code: 'PHYSICAL_INSPECTION',
      description:
        'Record inspection context where an authorized physical review is available.',
      status: isComplete ? 'PASS' : inProgress ? 'NOT_STARTED' : 'NOT_STARTED',
      title: 'Physical Inspection',
    },
    {
      code: 'LEGAL_REVIEW',
      description:
        'Review available legal-context evidence without presenting it as a legal guarantee.',
      status:
        status === 'REJECTED'
          ? 'FAIL'
          : isComplete
            ? 'PASS'
            : 'NOT_STARTED',
      title: 'Legal Review',
    },
    {
      code: 'FINAL_ASSESSMENT',
      description:
        'Prepare the final summary for OWERU review and decision where required.',
      status: isComplete ? 'PASS' : 'NOT_STARTED',
      title: 'Final Assessment',
    },
  ]

  return items.map((item, index) => ({
    code: item.code,
    completed_at:
      item.status === 'NOT_STARTED' ? null : isoDate(Math.min(18, 13 + index)),
    completed_by: item.status === 'NOT_STARTED' ? null : demoVerifierId,
    created_at: isoDate(12),
    description: item.description,
    findings: item.findings ?? '',
    id: `${verificationId}-check-${item.code.toLowerCase()}`,
    status: item.status,
    title: item.title,
    updated_at: isoDate(Math.min(20, 13 + index)),
    verification: verificationId,
  }))
}

function buildEvidence(
  verificationId: ID,
  propertyId: ID,
): VerificationEvidence[] {
  const evidenceItems: Array<{
    description: string
    relevance_note: string
    source_type: EvidenceSourceType
    title: string
  }> = [
    {
      description:
        'Document metadata and sighting record used to understand the submitted ownership context.',
      relevance_note:
        'Supports the property document review step without exposing private document storage.',
      source_type: 'USER_SUPPLIED',
      title: 'Ownership Document Sighted',
    },
    {
      description:
        'Authority-originated reference used as supporting context for the property record.',
      relevance_note:
        'Helps compare submitted property information with available authority context.',
      source_type: 'AUTHORITY_OBTAINED',
      title: 'Authority Record Reference',
    },
    {
      description:
        'OWERU-recorded inspection note tied to the property verification workflow.',
      relevance_note:
        'Provides inspection context for discovery and verification progress.',
      source_type: 'OWERU_ESTABLISHED',
      title: 'Inspection Note',
    },
  ]

  return evidenceItems.map((item, index) => {
    const evidenceId = `${propertyId}-evidence-${index + 1}`

    return {
      created_at: isoDate(14 + index),
      evidence: evidenceId,
      evidenceSummary: {
        description: item.description,
        document: index === 0 ? `${propertyId}-doc-title` : null,
        id: evidenceId,
        property: propertyId,
        recorded_at: isoDate(14 + index),
        recorded_by: index === 2 ? demoVerifierId : demoReviewerId,
        source_type: item.source_type,
        title: item.title,
      },
      id: `${verificationId}-evidence-link-${index + 1}`,
      linked_at: isoDate(15 + index),
      linked_by: demoVerifierId,
      linkedByName: 'Saad Baraka, OWERU Verifier',
      relevance_note: item.relevance_note,
      updated_at: isoDate(15 + index),
      verification: verificationId,
    }
  })
}

function buildFindings(
  verificationId: ID,
  status: VerificationStatus,
): VerificationFinding[] {
  const baseFindings: Array<{
    description: string
    severity: FindingSeverity
    title: string
  }> = [
    {
      description:
        'Submitted property details align with the reviewed marketplace record.',
      severity: 'INFORMATIONAL',
      title: 'Property details reviewed',
    },
  ]

  if (status === 'REJECTED') {
    baseFindings.push({
      description:
        'The current supporting evidence was not sufficient for approval at decision review.',
      severity: 'MEDIUM',
      title: 'Additional support required',
    })
  }

  if (status === 'IN_PROGRESS') {
    baseFindings.push({
      description:
        'Physical inspection information remains open before the verifier can submit.',
      severity: 'LOW',
      title: 'Inspection evidence pending',
    })
  }

  return baseFindings.map((finding, index) => ({
    created_at: isoDate(15 + index),
    description: finding.description,
    id: `${verificationId}-finding-${index + 1}`,
    recorded_at: isoDate(15 + index),
    recorded_by: demoVerifierId,
    recordedByName: 'Saad Baraka, OWERU Verifier',
    severity: finding.severity,
    title: finding.title,
    updated_at: isoDate(15 + index),
    verification: verificationId,
    verification_check: index === 0 ? `${verificationId}-check-property_details` : null,
  }))
}

function buildVerification({
  assignedDay,
  decidedDay,
  id,
  propertyId,
  requestedDay,
  startedDay,
  status,
  submittedDay,
}: {
  assignedDay?: number
  decidedDay?: number
  id: ID
  propertyId: ID
  requestedDay: number
  startedDay?: number
  status: VerificationStatus
  submittedDay?: number
}): VerificationDetails {
  const property = propertyById(propertyId)
  const decision: VerificationDecision | undefined =
    status === 'APPROVED' || status === 'REJECTED' || status === 'EXPIRED'
      ? {
          created_at: isoDate(decidedDay ?? 18),
          decided_at: isoDate(decidedDay ?? 18),
          decided_by: demoReviewerId,
          decidedByName: 'Amina Said, OWERU Review Desk',
          expires_at:
            status === 'APPROVED' || status === 'EXPIRED'
              ? '2027-08-18T17:00:00+03:00'
              : null,
          id: `${id}-decision`,
          outcome: status === 'REJECTED' ? 'REJECTED' : 'APPROVED',
          summary:
            status === 'REJECTED'
              ? 'The verification was not approved because the available support did not meet the recorded OWERU review threshold.'
              : 'Verification information was approved based on the recorded OWERU process and supporting evidence available at review time.',
          updated_at: isoDate(decidedDay ?? 18),
          verification: id,
        }
      : undefined

  return {
    assigned_at: assignedDay ? isoDate(assignedDay) : null,
    assigned_verifier: assignedDay ? demoVerifierId : null,
    assignedVerifierName: assignedDay
      ? 'Saad Baraka, OWERU Verifier'
      : undefined,
    availableEvidence: buildEvidence(id, propertyId).map(
      (link) => link.evidenceSummary,
    ),
    checks: buildChecks(id, status),
    created_at: isoDate(requestedDay),
    decided_at: decidedDay ? isoDate(decidedDay) : null,
    decision,
    decision_notes: decision?.summary ?? '',
    evidenceLinks:
      status === 'REQUESTED' || status === 'ASSIGNED'
        ? []
        : buildEvidence(id, propertyId),
    findings: buildFindings(id, status),
    id,
    property: propertyId,
    propertySummary: {
      area: property.area,
      bathrooms: property.bathrooms,
      bedrooms: property.bedrooms,
      currency: property.currency,
      id: property.id,
      image: property.image,
      location: property.location,
      price: property.price,
      propertyType: property.propertyType,
      status: property.status,
      title: property.title,
      transactionType: property.transactionType,
    },
    requested_at: isoDate(requestedDay),
    requested_by: demoRequesterId,
    requestedByName: 'Tolu Adewale',
    started_at: startedDay ? isoDate(startedDay) : null,
    status,
    submitted_at: submittedDay ? isoDate(submittedDay) : null,
    updated_at: isoDate(Math.max(decidedDay ?? 0, submittedDay ?? 0, startedDay ?? 0, assignedDay ?? 0, requestedDay)),
  }
}

export const mockVerificationRecords: VerificationDetails[] = [
  buildVerification({
    assignedDay: 13,
    id: 'ver-2026-00129',
    propertyId: 'owr-dar-000245',
    requestedDay: 12,
    startedDay: 14,
    status: 'IN_PROGRESS',
  }),
  buildVerification({
    assignedDay: 13,
    decidedDay: 18,
    id: 'ver-2026-00118',
    propertyId: 'owr-pwn-000118',
    requestedDay: 12,
    startedDay: 14,
    status: 'APPROVED',
    submittedDay: 17,
  }),
  buildVerification({
    id: 'ver-2026-00141',
    propertyId: 'owr-dar-000316',
    requestedDay: 25,
    status: 'REQUESTED',
  }),
  buildVerification({
    assignedDay: 24,
    id: 'ver-2026-00152',
    propertyId: 'owr-aru-000133',
    requestedDay: 23,
    status: 'ASSIGNED',
  }),
  buildVerification({
    assignedDay: 4,
    decidedDay: 11,
    id: 'ver-2026-00093',
    propertyId: 'owr-mza-000099',
    requestedDay: 2,
    startedDay: 6,
    status: 'REJECTED',
    submittedDay: 10,
  }),
  buildVerification({
    assignedDay: 1,
    decidedDay: 7,
    id: 'ver-2026-00071',
    propertyId: 'owr-dod-000211',
    requestedDay: 1,
    startedDay: 3,
    status: 'EXPIRED',
    submittedDay: 6,
  }),
]

export function getMockVerification(verificationId: string | undefined) {
  return mockVerificationRecords.find((record) => record.id === verificationId)
}

export function getMockVerificationWorkspace() {
  return mockVerificationRecords.filter((record) =>
    ['ASSIGNED', 'IN_PROGRESS', 'SUBMITTED', 'APPROVED'].includes(record.status),
  )
}
