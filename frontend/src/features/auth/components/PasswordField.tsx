import { useId, useState } from 'react'
import type { InputHTMLAttributes } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

type PasswordFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  error?: string
  helperText?: string
  label: string
}

export function PasswordField({
  className,
  error,
  helperText,
  id,
  label,
  ...props
}: PasswordFieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const descriptionId =
    helperText && !error ? `${inputId}-description` : undefined
  const errorId = error ? `${inputId}-error` : undefined
  const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="grid gap-2">
      <label className="text-sm font-bold text-foreground" htmlFor={inputId}>
        {label}
      </label>
      <span className="relative">
        <input
          aria-describedby={describedBy}
          aria-invalid={Boolean(error)}
          className={cn(
            'min-h-11 w-full rounded-control border bg-surface py-2 pl-3 pr-12 text-sm text-foreground shadow-sm transition placeholder:text-muted-foreground/75 focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15',
            error && 'border-danger focus:border-danger focus:ring-danger/15',
            className,
          )}
          id={inputId}
          type={isVisible ? 'text' : 'password'}
          {...props}
        />
        <button
          aria-label={isVisible ? 'Hide password' : 'Show password'}
          aria-pressed={isVisible}
          className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-control text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          type="button"
          onClick={() => setIsVisible((value) => !value)}
        >
          {isVisible ? (
            <EyeOff className="size-4" aria-hidden="true" />
          ) : (
            <Eye className="size-4" aria-hidden="true" />
          )}
        </button>
      </span>
      {descriptionId && (
        <p className="text-xs text-muted-foreground" id={descriptionId}>
          {helperText}
        </p>
      )}
      {errorId && (
        <p className="text-xs text-danger" id={errorId} role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
