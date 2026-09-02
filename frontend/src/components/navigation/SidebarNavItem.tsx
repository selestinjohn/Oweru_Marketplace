import type { ComponentType, SVGProps } from 'react'
import { NavLink } from 'react-router-dom'

export function SidebarNavItem({
  icon: Icon,
  label,
  to,
}: {
  icon: ComponentType<SVGProps<SVGSVGElement>>
  label: string
  to: string
}) {
  return (
    <NavLink
      className={({ isActive }) =>
        `flex min-h-11 items-center gap-3 rounded-control px-3 text-sm font-bold transition ${
          isActive
            ? 'bg-accent text-accent-foreground shadow-panel'
            : 'text-primary-foreground/80 hover:bg-white/10 hover:text-primary-foreground'
        }`
      }
      to={to}
    >
      <Icon className="size-4" aria-hidden="true" />
      {label}
    </NavLink>
  )
}
