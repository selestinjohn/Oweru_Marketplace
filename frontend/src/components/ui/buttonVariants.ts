import { cva } from 'class-variance-authority'

export const buttonVariants = cva(
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-control text-sm font-bold transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-60',
  {
    variants: {
      variant: {
        primary:
          'bg-accent text-accent-foreground shadow-panel hover:bg-gold-hover active:translate-y-px',
        secondary:
          'bg-primary text-primary-foreground shadow-panel hover:bg-navy-light active:translate-y-px',
        outline:
          'border bg-surface text-foreground shadow-sm hover:border-accent/50 hover:bg-muted active:translate-y-px',
        ghost:
          'text-muted-foreground hover:bg-muted hover:text-foreground active:translate-y-px',
      },
      size: {
        sm: 'px-3 py-2',
        md: 'px-4 py-2.5',
        lg: 'px-5 py-3',
        icon: 'size-11 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)
