import type { InputHTMLAttributes, ReactNode } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label: ReactNode
}

export function Checkbox({ className, label, ...props }: CheckboxProps) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-foreground">
      <span className="relative grid size-5 place-items-center">
        <input
          className={cn(
            'peer size-5 appearance-none rounded-[4px] border bg-surface transition checked:border-accent checked:bg-accent focus:outline-none focus:ring-4 focus:ring-accent/15',
            className,
          )}
          type="checkbox"
          {...props}
        />
        <Check
          className="pointer-events-none absolute size-3.5 text-accent-foreground opacity-0 transition peer-checked:opacity-100"
          aria-hidden="true"
        />
      </span>
      <span>{label}</span>
    </label>
  )
}
