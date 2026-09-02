import type { ID } from '@/types/api'
import type { PropertyListing } from '@/types/property'

export type VerificationStatus =
  | 'REQUESTED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'SUBMITTED'
  | 'APPROVED'
  | 'REJECTED'
  | 'EXPIRED'
  | 'CANCELLED'

export type VerificationCheckStatus =
  | 'NOT_STARTED'
  | 'PASS'
  | 'FAIL'
  | 'NOT_APPLICABLE'

export type FindingSeverity =
  | 'INFORMATIONAL'
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'CRITICAL'

export type VerificationDecisionOutcome = 'APPROVED' | 'REJECTED'

export type EvidenceSourceType =
  | 'USER_SUPPLIED'
  | 'AUTHORITY_OBTAINED'
  | 'OWERU_ESTABLISHED'

export type VerificationRecord = {
  assigned_at: string | null
  assigned_verifier: ID | null
  created_at: string
  decided_at: string | null
  decision_notes: string
  id: ID
  property: ID
  requested_at: string
  requested_by: ID
  started_at: string | null
  status: VerificationStatus
  submitted_at: string | null
  updated_at: string
}

export type VerificationCheck = {
  code: string
  completed_at: string | null
  completed_by: ID | null
  created_at: string
  description: string
  findings: string
  id: ID
  status: VerificationCheckStatus
  title: string
  updated_at: string
  verification: ID
}

export type VerificationFinding = {
  created_at: string
  description: string
  id: ID
  recorded_at: string
  recorded_by: ID
  recordedByName?: string
  severity: FindingSeverity
  title: string
  updated_at: string
  verification: ID
  verification_check: ID | null
}

export type VerificationEvidence = {
  created_at: string
  evidence: ID
  evidenceSummary: EvidenceSummary
  id: ID
  linked_at: string
  linked_by: ID
  linkedByName?: string
  relevance_note: string
  updated_at: string
  verification: ID
}

export type EvidenceSummary = {
  description: string
  document: ID | null
  id: ID
  property: ID
  recorded_at: string
  recorded_by: ID
  source_type: EvidenceSourceType
  title: string
}

export type VerificationDecision = {
  created_at: string
  decided_at: string
  decided_by: ID
  decidedByName?: string
  expires_at: string | null
  id: ID
  outcome: VerificationDecisionOutcome
  summary: string
  updated_at: string
  verification: ID
}

export type VerificationPropertySummary = Pick<
  PropertyListing,
  | 'area'
  | 'bathrooms'
  | 'bedrooms'
  | 'currency'
  | 'id'
  | 'image'
  | 'location'
  | 'price'
  | 'propertyType'
  | 'status'
  | 'title'
  | 'transactionType'
>

export type VerificationDetails = VerificationRecord & {
  assignedVerifierName?: string
  availableEvidence: EvidenceSummary[]
  checks: VerificationCheck[]
  decision?: VerificationDecision
  evidenceLinks: VerificationEvidence[]
  findings: VerificationFinding[]
  propertySummary: VerificationPropertySummary
  requestedByName: string
}

export type VerificationTimelineStageState =
  | 'completed'
  | 'current'
  | 'pending'
  | 'failed'
  | 'expired'
  | 'cancelled'

export type VerificationTimelineStage = {
  date?: string | null
  description: string
  key:
    | 'REQUESTED'
    | 'ASSIGNED'
    | 'IN_PROGRESS'
    | 'SUBMITTED'
    | 'DECISION'
    | 'EXPIRED'
    | 'CANCELLED'
  label: string
  state: VerificationTimelineStageState
}

export type CreateVerificationPayload = {
  property: ID
}

export type AssignVerificationPayload = {
  verifier: ID
}

export type AddVerificationCheckPayload = {
  code: string
  description?: string
  findings?: string
  status: VerificationCheckStatus
  title: string
}

export type AddVerificationFindingPayload = {
  description: string
  severity: FindingSeverity
  title: string
  verification_check?: ID
}

export type AttachVerificationEvidencePayload = {
  evidence: ID
  relevance_note?: string
}

export type DecideVerificationPayload = {
  expires_at?: string
  outcome: VerificationDecisionOutcome
  summary: string
}
