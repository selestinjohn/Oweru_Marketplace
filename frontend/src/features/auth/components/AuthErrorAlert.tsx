import { AlertTriangle } from 'lucide-react'

export function AuthErrorAlert({ message }: { message: string }) {
  return (
    <div
      className="flex gap-3 rounded-control border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger"
      role="alert"
    >
      <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <p className="leading-6">{message}</p>
    </div>
  )
}
