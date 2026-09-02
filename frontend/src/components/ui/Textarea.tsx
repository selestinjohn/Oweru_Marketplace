import { forwardRef, useId } from 'react'
import type { TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: string
  helperText?: string
  label?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, helperText, id, label, ...props }, ref) => {
  const generatedId = useId()
  const textareaId = id ?? props.name ?? generatedId
  const descriptionId =
    helperText && !error ? `${textareaId}-description` : undefined
  const errorId = error ? `${textareaId}-error` : undefined
  const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className="grid gap-2">
      {label && (
        <label
          className="text-sm font-bold text-foreground"
          htmlFor={textareaId}
        >
          {label}
        </label>
      )}
      <textarea
        aria-describedby={describedBy}
        aria-invalid={Boolean(error)}
        className={cn(
          'min-h-32 rounded-control border bg-surface px-3 py-3 text-sm text-foreground shadow-sm transition placeholder:text-muted-foreground/75 focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15',
          error && 'border-danger focus:border-danger focus:ring-danger/15',
          className,
        )}
        id={textareaId}
        ref={ref}
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
  },
)

Textarea.displayName = 'Textarea'
