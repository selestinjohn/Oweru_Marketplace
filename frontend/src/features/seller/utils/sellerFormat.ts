import type { BadgeProps } from '@/components/ui/Badge'
import { formatCurrency, titleCase } from '@/lib/format'
import type {
  SellerDocumentStatus,
  SellerDocumentType,
  SellerListing,
  SellerListingStatus,
  SellerPropertyBundle,
  SellerPropertyRelationship,
  SellerPropertyStatus,
  SellerPropertyType,
  SellerSourceType,
  SellerVerificationStatus,
} from '@/features/seller/types/seller.types'

export function propertyTypeLabel(type: SellerPropertyType) {
  const labels: Record<SellerPropertyType, string> = {
    APARTMENT: 'Apartment',
    COMMERCIAL: 'Commercial',
    FARM: 'Farm',
    HOUSE: 'House',
    LAND: 'Land',
    OFFICE: 'Office',
    OTHER: 'Other',
  }

  return labels[type]
}

export function propertyStatusLabel(status: SellerPropertyStatus) {
  const labels: Record<SellerPropertyStatus, string> = {
    AVAILABLE: 'Available',
    DRAFT: 'Draft',
    INACTIVE: 'Inactive',
    RENTED: 'Rented',
    RESERVED: 'Reserved',
    SOLD: 'Sold',
    UNDER_OFFER: 'Under Offer',
  }

  return labels[status]
}

export function listingStatusLabel(status: SellerListingStatus) {
  const labels: Record<SellerListingStatus, string> = {
    CLOSED: 'Closed',
    DRAFT: 'Draft',
    PAUSED: 'Paused',
    PENDING_REVIEW: 'Pending Review',
    PUBLISHED: 'Published',
    SOLD: 'Sold',
  }

  return labels[status]
}

export function documentTypeLabel(type: SellerDocumentType) {
  const labels: Record<SellerDocumentType, string> = {
    IDENTITY: 'Identity Document',
    OTHER: 'Other Document',
    OWNERSHIP: 'Ownership Document',
    SURVEY: 'Survey Document',
    TAX: 'Tax Document',
    TITLE: 'Title Document',
  }

  return labels[type]
}

export function documentStatusLabel(status: SellerDocumentStatus) {
  return titleCase(status)
}

export function sourceTypeLabel(sourceType: SellerSourceType) {
  const labels: Record<SellerSourceType, string> = {
    AUTHORITY_OBTAINED: 'Authority Obtained',
    OWERU_ESTABLISHED: 'Established by OWERU',
    USER_SUPPLIED: 'User Supplied',
  }

  return labels[sourceType]
}

export function relationshipLabel(relationship: SellerPropertyRelationship) {
  return titleCase(relationship)
}

export function sellerVerificationStatusLabel(status: SellerVerificationStatus) {
  const labels: Record<SellerVerificationStatus, string> = {
    APPROVED: 'Verified',
    ASSIGNED: 'Assigned',
    CANCELLED: 'Cancelled',
    EXPIRED: 'Expired',
    IN_PROGRESS: 'In Progress',
    REJECTED: 'Rejected',
    REQUESTED: 'Requested',
    SUBMITTED: 'Submitted',
  }

  return labels[status]
}

export function propertyStatusTone(
  status: SellerPropertyStatus,
): BadgeProps['tone'] {
  const tones: Record<SellerPropertyStatus, BadgeProps['tone']> = {
    AVAILABLE: 'success',
    DRAFT: 'muted',
    INACTIVE: 'muted',
    RENTED: 'navy',
    RESERVED: 'gold',
    SOLD: 'navy',
    UNDER_OFFER: 'gold',
  }

  return tones[status]
}

export function listingStatusTone(
  status: SellerListingStatus,
): BadgeProps['tone'] {
  const tones: Record<SellerListingStatus, BadgeProps['tone']> = {
    CLOSED: 'muted',
    DRAFT: 'muted',
    PAUSED: 'gold',
    PENDING_REVIEW: 'gold',
    PUBLISHED: 'success',
    SOLD: 'navy',
  }

  return tones[status]
}

export function documentStatusTone(
  status: SellerDocumentStatus,
): BadgeProps['tone'] {
  const tones: Record<SellerDocumentStatus, BadgeProps['tone']> = {
    ACCEPTED: 'success',
    EXPIRED: 'gold',
    REJECTED: 'danger',
    SUBMITTED: 'muted',
    UNDER_REVIEW: 'gold',
  }

  return tones[status]
}

export function sellerVerificationStatusTone(
  status: SellerVerificationStatus,
): BadgeProps['tone'] {
  const tones: Record<SellerVerificationStatus, BadgeProps['tone']> = {
    APPROVED: 'success',
    ASSIGNED: 'navy',
    CANCELLED: 'muted',
    EXPIRED: 'gold',
    IN_PROGRESS: 'gold',
    REJECTED: 'danger',
    REQUESTED: 'muted',
    SUBMITTED: 'navy',
  }

  return tones[status]
}

export function formatSellerPrice(listing: SellerListing) {
  return formatCurrency(Number(listing.price), listing.currency)
}

export function activeVerificationStatuses() {
  return ['REQUESTED', 'ASSIGNED', 'IN_PROGRESS', 'SUBMITTED'] as const
}

export function hasActiveVerification(bundle: SellerPropertyBundle) {
  return Boolean(
    bundle.verification &&
      activeVerificationStatuses().includes(
        bundle.verification.status as (typeof activeVerificationStatuses)[number],
      ),
  )
}

export function canRequestVerification(bundle: SellerPropertyBundle) {
  return (
    !bundle.verification ||
    ['REJECTED', 'EXPIRED', 'CANCELLED'].includes(bundle.verification.status)
  )
}

export function sellerPropertyDisplayName(bundle: SellerPropertyBundle) {
  return bundle.listing?.title ?? bundle.property.reference_number
}
