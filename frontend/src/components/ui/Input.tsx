import { useId } from 'react'
import type { InputHTMLAttributes } from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  helperText?: string
  error?: string
}

export function Input({
  className,
  error,
  helperText,
  id,
  label,
  ...props
}: InputProps) {
  const generatedId = useId()
  const inputId = id ?? props.name ?? generatedId
  const descriptionId =
    helperText && !error ? `${inputId}-description` : undefined
  const errorId = error ? `${inputId}-error` : undefined
  const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className="grid gap-2">
      {label && (
        <label className="text-sm font-bold text-foreground" htmlFor={inputId}>
          {label}
        </label>
      )}
      <input
        aria-describedby={describedBy}
        aria-invalid={Boolean(error)}
        className={cn(
          'min-h-11 rounded-control border bg-surface px-3 text-sm text-foreground shadow-sm transition placeholder:text-muted-foreground/75 focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15',
          error && 'border-danger focus:border-danger focus:ring-danger/15',
          className,
        )}
        id={inputId}
        {...props}
      />
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

export function SearchInput({
  className,
  error,
  helperText,
  id,
  label,
  ...props
}: InputProps) {
  const generatedId = useId()
  const inputId = id ?? props.name ?? generatedId
  const descriptionId =
    helperText && !error ? `${inputId}-description` : undefined
  const errorId = error ? `${inputId}-error` : undefined
  const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className="grid gap-2">
      {label && (
        <label className="text-sm font-bold text-foreground" htmlFor={inputId}>
          {label}
        </label>
      )}
      <span className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          aria-describedby={describedBy}
          aria-invalid={Boolean(error)}
          className={cn(
            'min-h-11 w-full rounded-control border bg-surface py-2 pl-10 pr-3 text-sm text-foreground shadow-sm transition placeholder:text-muted-foreground/75 focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15',
            error && 'border-danger focus:border-danger focus:ring-danger/15',
            className,
          )}
          id={inputId}
          {...props}
        />
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
