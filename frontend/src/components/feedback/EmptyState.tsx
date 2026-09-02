import { SearchX } from 'lucide-react'
import { OutlineButton } from '@/components/ui/Button'

export function EmptyState({
  action,
  message,
  title,
}: {
  action?: {
    label: string
    onClick: () => void
  }
  message: string
  title: string
}) {
  return (
    <div className="grid min-h-72 place-items-center rounded-card border bg-card p-8 text-center shadow-panel">
      <div>
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-accent/10 text-accent">
          <SearchX className="size-7" aria-hidden="true" />
        </span>
        <h2 className="mt-4 font-display text-2xl font-bold text-foreground">
          {title}
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          {message}
        </p>
        {action && (
          <OutlineButton className="mt-5" onClick={action.onClick}>
            {action.label}
          </OutlineButton>
        )}
      </div>
    </div>
  )
}
