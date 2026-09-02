import { useState } from 'react'
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Settings,
  UserCircle,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { routePaths } from '@/constants/routes'
import type {
  CurrentUserResponse,
  RoleCode,
} from '@/features/auth/types/auth.types'
import { formatRoleLabel } from '@/features/dashboard/utils/dashboardFormat'

export function UserMenu({
  currentUser,
  isLoggingOut,
  onLogout,
}: {
  currentUser: CurrentUserResponse | null
  isLoggingOut: boolean
  onLogout: () => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const displayName =
    currentUser?.party?.display_name ?? currentUser?.user.email ?? 'OWERU member'
  const email = currentUser?.user.email ?? 'No email on file'

  return (
    <div className="relative">
      <button
        className="inline-flex min-h-11 items-center gap-3 rounded-control border bg-surface py-1.5 pl-1.5 pr-3 text-sm font-bold text-foreground shadow-sm transition hover:border-accent/45 hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => setIsOpen((value) => !value)}
      >
        <span className="grid size-8 place-items-center rounded-control bg-primary text-xs font-extrabold text-primary-foreground">
          {initialsFor(displayName)}
        </span>
        <span className="hidden max-w-36 truncate sm:inline">{displayName}</span>
        <ChevronDown
          className="size-4 text-muted-foreground"
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-72 rounded-card border bg-card p-2 shadow-soft"
          role="menu"
        >
          <div className="border-b px-3 py-3">
            <p className="truncate text-sm font-bold text-foreground">
              {displayName}
            </p>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {email}
            </p>
            {currentUser?.roles.length ? (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {currentUser.roles.slice(0, 3).map((role) => (
                  <span
                    className="rounded-full border border-accent/20 bg-accent/10 px-2 py-1 text-[11px] font-bold text-accent"
                    key={role}
                  >
                    {formatRoleLabel(role as RoleCode)}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <NavLink
            className="mt-2 flex items-center gap-3 rounded-control px-3 py-2.5 text-sm font-bold text-foreground transition hover:bg-muted"
            role="menuitem"
            to={routePaths.dashboard}
            onClick={() => setIsOpen(false)}
          >
            <LayoutDashboard className="size-4 text-accent" aria-hidden="true" />
            Dashboard
          </NavLink>
          <NavLink
            className="flex items-center gap-3 rounded-control px-3 py-2.5 text-sm font-bold text-foreground transition hover:bg-muted"
            role="menuitem"
            to={routePaths.profile}
            onClick={() => setIsOpen(false)}
          >
            <UserCircle className="size-4 text-accent" aria-hidden="true" />
            Profile
          </NavLink>
          <NavLink
            className="flex items-center gap-3 rounded-control px-3 py-2.5 text-sm font-bold text-foreground transition hover:bg-muted"
            role="menuitem"
            to={routePaths.settings}
            onClick={() => setIsOpen(false)}
          >
            <Settings className="size-4 text-accent" aria-hidden="true" />
            Settings
          </NavLink>
          <button
            className="flex w-full items-center gap-3 rounded-control px-3 py-2.5 text-left text-sm font-bold text-danger transition hover:bg-danger/10"
            disabled={isLoggingOut}
            role="menuitem"
            type="button"
            onClick={() => {
              setIsOpen(false)
              onLogout()
            }}
          >
            <LogOut className="size-4" aria-hidden="true" />
            {isLoggingOut ? 'Signing out...' : 'Logout'}
          </button>
        </div>
      )}
    </div>
  )
}

function initialsFor(value: string) {
  const [first, second] = value.trim().split(/\s+/)

  return `${first?.[0] ?? 'O'}${second?.[0] ?? 'W'}`.toUpperCase()
}
