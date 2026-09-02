import { NavLink } from 'react-router-dom'
import { routePaths } from '@/constants/routes'
import type { DashboardNavItem } from '@/features/dashboard/types/dashboard.types'
import { cn } from '@/lib/utils'

export function DashboardNavLink({
  item,
  onNavigate,
}: {
  item: DashboardNavItem
  onNavigate?: () => void
}) {
  const Icon = item.icon

  return (
    <NavLink
      className={({ isActive }) =>
        cn(
          'flex min-h-11 items-center gap-3 rounded-control px-3 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
          isActive
            ? 'bg-primary-foreground/10 text-primary-foreground shadow-[inset_3px_0_0_var(--accent)]'
            : 'text-primary-foreground/72 hover:bg-primary-foreground/8 hover:text-primary-foreground',
        )
      }
      end={item.href === routePaths.dashboard}
      to={item.href}
      onClick={onNavigate}
    >
      {({ isActive }) => (
        <>
          <Icon
            className={cn(
              'size-4 shrink-0 transition',
              isActive ? 'text-gold' : 'text-primary-foreground/58',
            )}
            aria-hidden="true"
          />
          <span className="truncate">{item.label}</span>
        </>
      )}
    </NavLink>
  )
}
