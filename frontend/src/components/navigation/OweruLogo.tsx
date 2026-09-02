import oweruMark from '@/assets/brand/oweru-mark.svg'
import { cn } from '@/lib/utils'

export function OweruLogo({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  return (
    <span className="flex items-center gap-3" aria-label="OWERU Marketplace">
      <img className="size-10 rounded-card shadow-panel" src={oweruMark} alt="" />
      <span className="leading-tight">
        <span
          className={cn(
            'block font-display text-lg font-bold',
            tone === 'light' ? 'text-primary-foreground' : 'text-foreground',
          )}
        >
          OWERU
        </span>
        <span
          className={cn(
            'block text-xs font-semibold uppercase',
            tone === 'light' ? 'text-primary-foreground/70' : 'text-muted-foreground',
          )}
        >
          Marketplace
        </span>
      </span>
    </span>
  )
}
