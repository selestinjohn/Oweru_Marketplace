import type { LucideIcon } from 'lucide-react'
import type { ID } from '@/types/api'

export type SellerPropertyType =
  | 'LAND'
  | 'HOUSE'
  | 'APARTMENT'
  | 'COMMERCIAL'
  | 'OFFICE'
  | 'FARM'
  | 'OTHER'

export type SellerPropertyStatus =
  | 'DRAFT'
  | 'AVAILABLE'
  | 'UNDER_OFFER'
  | 'SOLD'
  | 'RENTED'
  | 'RESERVED'
  | 'INACTIVE'

export type SellerListingStatus =
  | 'DRAFT'
  | 'PENDING_REVIEW'
  | 'PUBLISHED'
  | 'PAUSED'
  | 'SOLD'
  | 'CLOSED'

export type SellerDocumentType =
  | 'TITLE'
  | 'OWNERSHIP'
  | 'TAX'
  | 'IDENTITY'
  | 'SURVEY'
  | 'OTHER'

export type SellerDocumentStatus =
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'EXPIRED'

export type SellerSourceType =
  | 'OWERU_ESTABLISHED'
  | 'USER_SUPPLIED'
  | 'AUTHORITY_OBTAINED'

export type SellerPropertyRelationship =
  | 'OWNER'
  | 'CLAIMANT'
  | 'SELLER'
  | 'MANAGER'

export type SellerVerificationStatus =
  | 'REQUESTED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'SUBMITTED'
  | 'APPROVED'
  | 'REJECTED'
  | 'EXPIRED'
  | 'CANCELLED'

export type SellerPropertyRecord = {
  created_at: string
  description: string
  id: ID
  image: string
  latitude: string | null
  location_description: string
  longitude: string | null
  ownership_basis: string
  project: { id: ID; name: string } | null
  property_type: SellerPropertyType
  reference_number: string
  status: SellerPropertyStatus
  updated_at: string
}

export type SellerListing = {
  created_at: string
  currency: 'TZS' | string
  description: string
  id: ID
  is_promoted: boolean
  price: string
  property: ID
  published_at: string | null
  status: SellerListingStatus
  title: string
  updated_at: string
}

export type SellerDocumentSummary = {
  created_at: string
  description: string
  document_type: SellerDocumentType
  expires_at: string | null
  id: ID
  issued_at: string | null
  property: ID
  sighted_at: string | null
  source_type: SellerSourceType
  status: SellerDocumentStatus
  updated_at: string
  uploaded_by: ID
}

export type SellerParticipantSummary = {
  basis: string
  ended_at: string | null
  id: ID
  party_display_name: string
  relationship: SellerPropertyRelationship
  source_type: SellerSourceType
  started_at: string
}

export type SellerVerificationSummary = {
  assigned_at: string | null
  assigned_verifier_name: string | null
  created_at: string
  decided_at: string | null
  expires_at: string | null
  id: ID
  property: ID
  requested_at: string
  status: SellerVerificationStatus
  submitted_at: string | null
  updated_at: string
}

export type SellerActivity = {
  description: string
  href?: string
  icon: LucideIcon
  id: ID
  timestamp: string
  title: string
}

export type SellerAttentionTone = 'gold' | 'navy' | 'success' | 'warning'

export type SellerAttentionItem = {
  actionHref: string
  actionLabel: string
  context: string
  id: ID
  status: string
  title: string
  tone: SellerAttentionTone
}

export type SellerPropertyBundle = {
  activity: SellerActivity[]
  documents: SellerDocumentSummary[]
  listing: SellerListing | null
  participants: SellerParticipantSummary[]
  property: SellerPropertyRecord
  verification: SellerVerificationSummary | null
}

export type SellerOverviewMetric = {
  context: string
  icon: LucideIcon
  id: ID
  label: string
  tone: SellerAttentionTone
  value: string
}

export type SellerOverview = {
  attention: SellerAttentionItem[]
  metrics: SellerOverviewMetric[]
  recentActivity: SellerActivity[]
}

export type CreatePropertyPayload = {
  description?: string
  latitude?: number | null
  location_description?: string
  longitude?: number | null
  ownership_basis?: string
  project?: ID | null
  property_type: SellerPropertyType
  reference_number: string
}

export type UpdatePropertyPayload = Partial<CreatePropertyPayload>

export type CreateListingPayload = {
  currency: string
  description: string
  price: string
  property: ID
  title: string
}

export type UpdateListingPayload = Partial<CreateListingPayload>

export type CreateDocumentPayload = {
  description?: string
  document_type: SellerDocumentType
  expires_at?: string
  file: File
  issued_at?: string
  property: ID
  source_type: 'USER_SUPPLIED'
}

export type ListingWorkflowAction = 'publish' | 'pause' | 'resume' | 'close'
