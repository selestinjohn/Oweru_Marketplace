import { LogOut } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { OweruLogo } from '@/components/navigation/OweruLogo'
import { OutlineButton } from '@/components/ui/Button'
import { routePaths } from '@/constants/routes'
import type { CurrentUserResponse } from '@/features/auth/types/auth.types'
import { getDashboardNavSections } from '@/features/dashboard/data/dashboardNavigation'
import { DashboardNavLink } from './DashboardNavLink'

export function DashboardSidebar({
  currentUser,
  isLoggingOut,
  onLogout,
  onNavigate,
}: {
  currentUser: CurrentUserResponse | null
  isLoggingOut: boolean
  onLogout: () => void
  onNavigate?: () => void
}) {
  const navSections = getDashboardNavSections(currentUser)

  return (
    <aside className="flex h-full min-h-screen flex-col bg-primary px-4 py-5 text-primary-foreground">
      <NavLink
        className="mx-1 rounded-control focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        to={routePaths.dashboard}
        onClick={onNavigate}
      >
        <OweruLogo tone="light" />
      </NavLink>

      <nav className="mt-8 grid gap-7" aria-label="Dashboard navigation">
        {navSections.map((section) => (
          <section className="grid gap-2" key={section.label}>
            <h2 className="px-3 text-xs font-extrabold uppercase text-primary-foreground/42">
              {section.label}
            </h2>
            <div className="grid gap-1">
              {section.items.map((item) => (
                <DashboardNavLink
                  item={item}
                  key={item.href}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </section>
        ))}
      </nav>

      <div className="mt-auto border-t border-primary-foreground/10 pt-4">
        <OutlineButton
          className="w-full border-primary-foreground/14 bg-primary-foreground/6 text-primary-foreground hover:bg-primary-foreground/12"
          disabled={isLoggingOut}
          onClick={onLogout}
        >
          <LogOut className="size-4" aria-hidden="true" />
          {isLoggingOut ? 'Signing out...' : 'Logout'}
        </OutlineButton>
      </div>
    </aside>
  )
}
