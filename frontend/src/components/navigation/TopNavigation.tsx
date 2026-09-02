import { useState } from 'react'
import {
  Bell,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  UserCircle,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { AppContainer } from '@/components/common/AppContainer'
import { IconButton } from '@/components/ui/Button'
import { buttonVariants } from '@/components/ui/buttonVariants'
import { publicNavigation } from '@/constants/navigation'
import { routePaths } from '@/constants/routes'
import { useAuth } from '@/app/providers/authContext'
import { useLogout } from '@/features/auth/hooks/useLogout'
import { cn } from '@/lib/utils'
import { MobileNavigationDrawer } from './MobileNavigationDrawer'
import { OweruLogo } from './OweruLogo'

export function TopNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { isAuthenticated, isLoading, party, user } = useAuth()
  const logout = useLogout()
  const accountLabel = party?.display_name ?? user?.email ?? 'Account'
  const accountInitials = initialsFor(accountLabel)
  const navItemClass =
    'rounded-full px-4 py-2 transition hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

  return (
    <header className="sticky top-0 z-40 border-b bg-surface/95 shadow-[0_1px_0_rgba(15,23,42,0.04)] backdrop-blur-xl">
      <AppContainer className="flex min-h-20 items-center justify-between gap-6">
        <NavLink
          className="rounded-control focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          to={routePaths.home}
        >
          <OweruLogo />
        </NavLink>

        <nav
          className="hidden items-center rounded-full border bg-surface-muted/70 p-1 text-sm font-bold text-muted-foreground shadow-sm lg:flex"
          aria-label="Primary navigation"
        >
          {publicNavigation.map((item) => (
            'href' in item ? (
              <a className={navItemClass} href={item.href} key={item.label}>
                {item.label}
              </a>
            ) : (
              <NavLink
                className={({ isActive }) =>
                  cn(
                    navItemClass,
                    isActive && 'bg-surface text-foreground shadow-sm',
                  )
                }
                key={item.label}
                to={item.to}
              >
                {item.label}
              </NavLink>
            )
          ))}
        </nav>

        {isLoading ? (
          <div className="hidden h-11 w-40 animate-pulse rounded-control bg-muted lg:block" />
        ) : isAuthenticated ? (
          <div className="hidden items-center gap-2 lg:flex">
            <IconButton label="Open notifications" variant="outline">
              <Bell className="size-5" aria-hidden="true" />
            </IconButton>

            <div className="relative">
              <button
                className="inline-flex min-h-11 items-center gap-3 rounded-control border bg-surface py-1.5 pl-1.5 pr-3 text-sm font-bold text-foreground shadow-sm transition hover:border-accent/45 hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                type="button"
                aria-expanded={isProfileOpen}
                aria-haspopup="menu"
                onClick={() => setIsProfileOpen((value) => !value)}
              >
                <span className="grid size-8 place-items-center rounded-control bg-primary text-xs font-extrabold text-primary-foreground">
                  {accountInitials}
                </span>
                <span className="max-w-36 truncate">{accountLabel}</span>
                <ChevronDown className="size-4 text-muted-foreground" aria-hidden="true" />
              </button>

              {isProfileOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 rounded-card border bg-card p-2 shadow-soft"
                  role="menu"
                >
                  <NavLink
                    className="flex items-center gap-3 rounded-control px-3 py-2.5 text-sm font-bold text-foreground transition hover:bg-muted"
                    role="menuitem"
                    to={routePaths.dashboard}
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <LayoutDashboard className="size-4 text-accent" aria-hidden="true" />
                    Dashboard
                  </NavLink>
                  <NavLink
                    className="flex items-center gap-3 rounded-control px-3 py-2.5 text-sm font-bold text-foreground transition hover:bg-muted"
                    role="menuitem"
                    to={routePaths.profile}
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <UserCircle className="size-4 text-accent" aria-hidden="true" />
                    Profile
                  </NavLink>
                  <NavLink
                    className="flex items-center gap-3 rounded-control px-3 py-2.5 text-sm font-bold text-foreground transition hover:bg-muted"
                    role="menuitem"
                    to={routePaths.settings}
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <Settings className="size-4 text-accent" aria-hidden="true" />
                    Settings
                  </NavLink>
                  <button
                    className="flex w-full items-center gap-3 rounded-control px-3 py-2.5 text-left text-sm font-bold text-danger transition hover:bg-danger/10"
                    disabled={logout.isPending}
                    role="menuitem"
                    type="button"
                    onClick={() => {
                      setIsProfileOpen(false)
                      logout.mutate()
                    }}
                  >
                    <LogOut className="size-4" aria-hidden="true" />
                    {logout.isPending ? 'Signing out...' : 'Logout'}
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="hidden items-center gap-2 lg:flex">
            <NavLink
              className={cn(buttonVariants({ variant: 'outline' }))}
              to={routePaths.login}
            >
              Log in
            </NavLink>
            <NavLink
              className={cn(buttonVariants({ variant: 'primary' }))}
              to={routePaths.register}
            >
              Sign up
            </NavLink>
          </div>
        )}

        <IconButton
          className="lg:hidden"
          label="Open navigation"
          variant="outline"
          aria-controls="mobile-navigation"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen(true)}
        >
          <Menu className="size-5" aria-hidden="true" />
        </IconButton>
      </AppContainer>

      <MobileNavigationDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </header>
  )
}

function initialsFor(value: string) {
  const [first, second] = value.trim().split(/\s+/)

  if (!first) {
    return 'OW'
  }

  return `${first[0] ?? ''}${second?.[0] ?? ''}`.toUpperCase()
}
