import { Badge } from '@/components/ui/Badge'
import type {
  SellerDocumentStatus,
  SellerListingStatus,
  SellerPropertyStatus,
  SellerVerificationStatus,
} from '@/features/seller/types/seller.types'
import {
  documentStatusLabel,
  documentStatusTone,
  listingStatusLabel,
  listingStatusTone,
  propertyStatusLabel,
  propertyStatusTone,
  sellerVerificationStatusLabel,
  sellerVerificationStatusTone,
} from '@/features/seller/utils/sellerFormat'

export function SellerPropertyStatusBadge({
  status,
}: {
  status: SellerPropertyStatus
}) {
  return <Badge tone={propertyStatusTone(status)}>{propertyStatusLabel(status)}</Badge>
}

export function SellerListingStatusBadge({
  status,
}: {
  status: SellerListingStatus
}) {
  return <Badge tone={listingStatusTone(status)}>{listingStatusLabel(status)}</Badge>
}

export function SellerDocumentStatusBadge({
  status,
}: {
  status: SellerDocumentStatus
}) {
  return <Badge tone={documentStatusTone(status)}>{documentStatusLabel(status)}</Badge>
}

export function SellerVerificationStatusBadge({
  status,
}: {
  status: SellerVerificationStatus
}) {
  return (
    <Badge tone={sellerVerificationStatusTone(status)}>
      {sellerVerificationStatusLabel(status)}
    </Badge>
  )
}
