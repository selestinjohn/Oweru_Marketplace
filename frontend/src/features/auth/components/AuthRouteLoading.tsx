import { Loader2, ShieldCheck } from 'lucide-react'

export function AuthRouteLoading() {
  return (
    <div
      className="grid min-h-[52vh] place-items-center bg-background px-4"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="grid justify-items-center gap-4 rounded-card border bg-card p-8 text-center shadow-panel">
        <span className="grid size-12 place-items-center rounded-control bg-accent/10 text-accent">
          <ShieldCheck className="size-6" aria-hidden="true" />
        </span>
        <div>
          <p className="font-display text-lg font-bold text-foreground">
            Securing your OWERU session
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Checking account access before continuing.
          </p>
        </div>
        <Loader2 className="size-5 animate-spin text-accent" aria-hidden="true" />
      </div>
    </div>
  )
}
