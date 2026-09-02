import { AlertTriangle } from 'lucide-react'
import { OutlineButton } from '@/components/ui/Button'

export function ErrorState({
  action,
  message,
  title = 'Something went wrong',
}: {
  action?: {
    label: string
    onClick: () => void
  }
  message: string
  title?: string
}) {
  return (
    <div className="rounded-card border border-danger/25 bg-card p-6 text-danger shadow-panel">
      <span className="grid size-11 place-items-center rounded-full bg-danger/10">
        <AlertTriangle className="size-5" aria-hidden="true" />
      </span>
      <h2 className="mt-4 font-display text-2xl font-bold">{title}</h2>
      <p className="mt-2 max-w-xl text-sm leading-6 text-danger/85">{message}</p>
      {action && (
        <OutlineButton className="mt-5" onClick={action.onClick}>
          {action.label}
        </OutlineButton>
      )}
    </div>
  )
}
