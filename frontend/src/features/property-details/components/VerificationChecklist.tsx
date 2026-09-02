import { Badge } from '@/components/ui/Badge'
import type { VerificationCheck } from '@/types/property'
import {
  checkStatusLabel,
  statusTone,
} from '@/features/property-details/utils/propertyDetailsUi'

export function VerificationChecklist({
  checks,
}: {
  checks: VerificationCheck[]
}) {
  return (
    <div className="grid gap-3">
      <h3 className="font-display text-xl font-bold text-foreground">
        Verification Checklist
      </h3>
      <div className="grid gap-2">
        {checks.map((check) => (
          <div
            className="flex flex-col gap-3 rounded-control border bg-surface px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            key={check.id}
          >
            <span className="text-sm font-semibold text-foreground">
              {check.label}
            </span>
            <Badge tone={statusTone(check.status)}>
              {checkStatusLabel(check.status)}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  )
}
