import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import type { VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { buttonVariants } from './buttonVariants'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    children: ReactNode
  }

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, size, variant, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      ref={ref}
      type="button"
      {...props}
    >
      {children}
    </button>
  ),
)

Button.displayName = 'Button'

export const PrimaryButton = forwardRef<
  HTMLButtonElement,
  Omit<ButtonProps, 'variant'>
>((props, ref) => <Button ref={ref} variant="primary" {...props} />)

PrimaryButton.displayName = 'PrimaryButton'

export const SecondaryButton = forwardRef<
  HTMLButtonElement,
  Omit<ButtonProps, 'variant'>
>((props, ref) => <Button ref={ref} variant="secondary" {...props} />)

SecondaryButton.displayName = 'SecondaryButton'

export const OutlineButton = forwardRef<
  HTMLButtonElement,
  Omit<ButtonProps, 'variant'>
>((props, ref) => <Button ref={ref} variant="outline" {...props} />)

OutlineButton.displayName = 'OutlineButton'

export const IconButton = forwardRef<
  HTMLButtonElement,
  Omit<ButtonProps, 'children' | 'size'> & {
    children: ReactNode
    label: string
  }
>(({ label, ...props }, ref) => (
  <Button aria-label={label} ref={ref} size="icon" {...props}>
    {props.children}
  </Button>
))

IconButton.displayName = 'IconButton'

export { Button }
