import { CheckCircle2 } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { buttonVariants } from '@/components/ui/buttonVariants'
import { routePaths } from '@/constants/routes'
import { cn } from '@/lib/utils'

export function AuthSuccessState({
  ctaLabel = 'Continue to login',
  message,
  title,
}: {
  ctaLabel?: string
  message: string
  title: string
}) {
  return (
    <div className="rounded-card border bg-card p-6 text-center shadow-panel">
      <span className="mx-auto grid size-14 place-items-center rounded-control bg-success/10 text-success">
        <CheckCircle2 className="size-7" aria-hidden="true" />
      </span>
      <h1 className="mt-5 font-display text-2xl font-bold text-foreground">
        {title}
      </h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{message}</p>
      <NavLink
        className={cn(buttonVariants({ variant: 'primary' }), 'mt-6 w-full')}
        to={routePaths.login}
      >
        {ctaLabel}
      </NavLink>
    </div>
  )
}
