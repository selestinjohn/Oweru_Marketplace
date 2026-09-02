import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export function DisplayHeading({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={cn(
        'font-display text-4xl font-bold leading-[1.02] text-foreground sm:text-5xl lg:text-6xl',
        className,
      )}
      {...props}
    />
  )
}

export function PageHeading({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={cn(
        'font-display text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl',
        className,
      )}
      {...props}
    />
  )
}

export function SectionHeadingText({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        'font-display text-2xl font-bold leading-tight text-foreground',
        className,
      )}
      {...props}
    />
  )
}

export function CardHeading({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        'font-display text-xl font-bold leading-tight text-foreground',
        className,
      )}
      {...props}
    />
  )
}

export function BodyText({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('text-base leading-7 text-muted-foreground', className)}
      {...props}
    />
  )
}

export function SmallText({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('text-sm leading-6 text-muted-foreground', className)}
      {...props}
    />
  )
}

export function LabelText({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn('text-sm font-bold text-foreground', className)}
      {...props}
    />
  )
}

export function CaptionText({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'text-xs font-bold uppercase tracking-normal text-muted-foreground',
        className,
      )}
      {...props}
    />
  )
}
