import type { HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { CheckCircle2, Clock3, ShieldCheck, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { VerificationState } from '@/types/property'

const badgeVariants = cva(
  'inline-flex min-h-7 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-extrabold uppercase leading-none',
  {
    variants: {
      tone: {
        navy: 'border-primary/10 bg-primary/5 text-primary',
        gold: 'border-accent/20 bg-accent/10 text-accent',
        success: 'border-success/20 bg-success/10 text-success',
        muted: 'border-border bg-muted text-muted-foreground',
        danger: 'border-danger/20 bg-danger/10 text-danger',
      },
    },
    defaultVariants: {
      tone: 'navy',
    },
  },
)

export type BadgeProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants>

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />
}

export function VerificationBadge({ state }: { state: VerificationState }) {
  const content = {
    verified: {
      icon: ShieldCheck,
      label: 'Verified',
      tone: 'success' as const,
    },
    pending: {
      icon: Clock3,
      label: 'Pending',
      tone: 'muted' as const,
    },
    in_review: {
      icon: CheckCircle2,
      label: 'In Review',
      tone: 'gold' as const,
    },
    rejected: {
      icon: XCircle,
      label: 'Rejected',
      tone: 'danger' as const,
    },
  }[state]
  const Icon = content.icon

  return (
    <Badge tone={content.tone}>
      <Icon className="size-3.5" aria-hidden="true" />
      {content.label}
    </Badge>
  )
}

export function StatusBadge({
  status,
}: {
  status: 'sale' | 'rent' | string
}) {
  return (
    <Badge tone={status === 'rent' ? 'navy' : 'gold'}>
      {status === 'rent' ? 'For Rent' : status === 'sale' ? 'For Sale' : status}
    </Badge>
  )
}
