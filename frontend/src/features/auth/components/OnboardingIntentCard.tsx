import { ArrowRight, Clock3 } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { buttonVariants } from '@/components/ui/buttonVariants'
import type { OnboardingIntent } from '@/features/auth/data/authContent'
import { cn } from '@/lib/utils'

export function OnboardingIntentCard({ intent }: { intent: OnboardingIntent }) {
  const Icon = intent.icon
  const targetPath = intent.status === 'available' ? intent.to : undefined

  return (
    <Card className="group grid gap-5 p-5 transition duration-200 hover:-translate-y-0.5 hover:border-accent/35 hover:shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <span className="grid size-11 place-items-center rounded-control bg-accent/10 text-accent">
          <Icon className="size-5" aria-hidden="true" />
        </span>
        {!targetPath && (
          <Badge tone="muted">
            <Clock3 className="size-3.5" aria-hidden="true" />
            Pending
          </Badge>
        )}
      </div>

      <div>
        <h2 className="font-display text-lg font-bold text-foreground">
          {intent.label}
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {intent.description}
        </p>
      </div>

      {targetPath ? (
        <NavLink
          className={cn(
            buttonVariants({ variant: 'outline' }),
            'mt-auto justify-between',
          )}
          to={targetPath}
        >
          Continue
          <ArrowRight className="size-4" aria-hidden="true" />
        </NavLink>
      ) : (
        <button
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'mt-auto justify-start',
          )}
          disabled
          type="button"
        >
          Approval workflow pending
        </button>
      )}
    </Card>
  )
}
