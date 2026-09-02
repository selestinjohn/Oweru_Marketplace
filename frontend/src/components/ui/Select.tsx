import { forwardRef } from 'react'
import type { SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string
  options: Array<{ label: string; value: string }>
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, id, label, options, ...props }, ref) => {
  const selectId = id ?? props.name

  return (
    <label className="grid gap-2 text-sm font-bold text-foreground">
      {label && <span>{label}</span>}
      <span className="relative">
        <select
          className={cn(
            'min-h-11 w-full appearance-none rounded-control border bg-surface px-3 pr-9 text-sm text-foreground shadow-sm transition focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15',
            className,
          )}
          id={selectId}
          ref={ref}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
      </span>
    </label>
  )
  },
)

Select.displayName = 'Select'
