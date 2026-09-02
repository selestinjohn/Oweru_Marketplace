import type { ID } from './api'

export type TransactionType = 'sale' | 'rent'
export type PropertyStatus =
  | 'available'
  | 'under_offer'
  | 'reserved'
  | 'sold'
  | 'rented'
  | 'inactive'
export type PropertyType =
  | 'house'
  | 'apartment'
  | 'land'
  | 'commercial'
  | 'warehouse'
  | 'agricultural'
export type VerificationState = 'verified' | 'pending' | 'in_review' | 'rejected'

export type PropertyListing = {
  id: ID
  title: string
  location: string
  price: number
  currency: 'TZS'
  propertyType: PropertyType
  transactionType: TransactionType
  status: PropertyStatus
  bedrooms?: number
  bathrooms?: number
  area: number
  image: string
  verified: boolean
  verificationState: VerificationState
  listedBy: string
  listedOn: string
  featured?: boolean
}

export type PropertySummary = PropertyListing

export type PropertyImage = {
  alt: string
  id: ID
  isPrimary?: boolean
  url: string
}

export type PropertyFeature = {
  id: ID
  label: string
}

export type PropertyDetailItem = {
  label: string
  value: string
}

export type PropertyLocationInfo = {
  area: string
  city: string
  coordinates?: {
    latitude: number
    longitude: number
  }
  district: string
  note: string
}

export type DocumentReviewStatus =
  | 'accepted'
  | 'under_review'
  | 'rejected'
  | 'pending'
export type DocumentAccessState =
  | 'restricted'
  | 'login_required'
  | 'authorized_due_diligence'

export type PropertyDocumentSummary = {
  access: DocumentAccessState
  expiryDate?: string
  id: ID
  issueDate?: string
  reviewStatus: DocumentReviewStatus
  source: string
  title: string
  type: string
}

export type VerificationWorkflowStatus =
  | 'requested'
  | 'assigned'
  | 'in_progress'
  | 'submitted'
  | 'approved'
  | 'rejected'
  | 'expired'
  | 'cancelled'

export type VerificationTimelineState =
  | 'completed'
  | 'active'
  | 'pending'
  | 'failed'

export type VerificationTimelineStep = {
  date?: string
  label: string
  state: VerificationTimelineState
  status: VerificationWorkflowStatus
}

export type VerificationCheckStatus =
  | 'completed'
  | 'in_progress'
  | 'pending'
  | 'pass'
  | 'fail'
  | 'not_applicable'

export type VerificationCheck = {
  id: ID
  label: string
  status: VerificationCheckStatus
}

export type VerificationFindingSeverity =
  | 'informational'
  | 'low'
  | 'medium'
  | 'high'
  | 'critical'

export type VerificationFinding = {
  description: string
  id: ID
  severity: VerificationFindingSeverity
  title: string
}

export type EvidenceSummary = {
  id: ID
  recordedDate: string
  relevance: string
  sourceType: string
  title: string
}

export type PropertyVerificationSummary = {
  assignedVerifier: string
  checks: VerificationCheck[]
  decisionDate?: string
  evidence: EvidenceSummary[]
  expiryDate?: string
  findings: VerificationFinding[]
  id: ID
  performedBy: string
  requestedDate: string
  startedDate?: string
  status: VerificationWorkflowStatus
  submittedDate?: string
  summaryNote: string
  timeline: VerificationTimelineStep[]
  verifiedOn?: string
}

export type PropertyHistoryEvent = {
  date: string
  description: string
  event: string
  id: ID
}

export type PropertyDetails = PropertyListing & {
  description: string
  detailItems: PropertyDetailItem[]
  documents: PropertyDocumentSummary[]
  features: PropertyFeature[]
  history: PropertyHistoryEvent[]
  images: PropertyImage[]
  locationInfo: PropertyLocationInfo
  verification: PropertyVerificationSummary
}

export type PropertyFilters = {
  propertyType: 'all' | PropertyType
  transactionType: 'all' | TransactionType
  location: string
  minPrice: string
  maxPrice: string
  bedrooms: 'any' | '1' | '2' | '3' | '4' | '5'
  minSize: string
  maxSize: string
}

export type PropertySort = 'newest' | 'price-low' | 'price-high' | 'largest'
