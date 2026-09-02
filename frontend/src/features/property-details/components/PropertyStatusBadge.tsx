import { Badge } from '@/components/ui/Badge'
import {
  propertyStatusLabel,
  statusTone,
} from '@/features/property-details/utils/propertyDetailsUi'
import type { PropertyStatus } from '@/types/property'

export function PropertyStatusBadge({ status }: { status: PropertyStatus }) {
  return <Badge tone={statusTone(status)}>{propertyStatusLabel(status)}</Badge>
}
