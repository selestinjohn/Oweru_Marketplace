import { LayoutDashboard, LogOut, Settings, UserCircle, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { publicNavigation } from '@/constants/navigation'
import { routePaths } from '@/constants/routes'
import { IconButton } from '@/components/ui/Button'
import { buttonVariants } from '@/components/ui/buttonVariants'
import { useAuth } from '@/app/providers/authContext'
import { useLogout } from '@/features/auth/hooks/useLogout'
import { cn } from '@/lib/utils'
import { OweruLogo } from './OweruLogo'

export function MobileNavigationDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const { isAuthenticated, isLoading, party, user } = useAuth()
  const logout = useLogout()
  const accountLabel = party?.display_name ?? user?.email ?? 'Account'

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
      <button
        className="absolute inset-0 bg-primary/45 backdrop-blur-sm"
        type="button"
        aria-label="Close navigation"
        onClick={onClose}
      />

      <aside
        className="absolute right-0 top-0 flex h-full w-[min(88vw,380px)] flex-col border-l bg-surface shadow-soft"
        id="mobile-navigation"
        data-testid="mobile-navigation"
      >
        <div className="flex min-h-20 items-center justify-between border-b px-5">
          <OweruLogo />
          <IconButton label="Close navigation" variant="outline" onClick={onClose}>
            <X className="size-5" aria-hidden="true" />
          </IconButton>
        </div>

        <nav className="grid gap-1 p-5" aria-label="Mobile navigation">
          {publicNavigation.map((item) => (
            'href' in item ? (
              <a
                className="rounded-control px-4 py-3 text-base font-bold text-foreground transition hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                href={item.href}
                key={item.label}
                onClick={onClose}
              >
                {item.label}
              </a>
            ) : (
              <NavLink
                className={({ isActive }) =>
                  `rounded-control px-4 py-3 text-base font-bold transition ${
                    isActive
                      ? 'bg-accent/10 text-accent'
                      : 'text-foreground hover:bg-muted'
                  }`
                }
                key={item.label}
                onClick={onClose}
                to={item.to}
              >
                {item.label}
              </NavLink>
            )
          ))}
        </nav>

        {isLoading ? (
          <div className="mt-auto border-t p-5">
            <div className="h-11 animate-pulse rounded-control bg-muted" />
          </div>
        ) : isAuthenticated ? (
          <div className="mt-auto grid gap-3 border-t p-5">
            <div className="rounded-card border bg-muted/70 p-4">
              <p className="text-xs font-bold uppercase text-accent">
                Signed in
              </p>
              <p className="mt-1 truncate text-sm font-bold text-foreground">
                {accountLabel}
              </p>
            </div>
            <NavLink
              className={cn(buttonVariants({ variant: 'outline' }))}
              onClick={onClose}
              to={routePaths.dashboard}
            >
              <LayoutDashboard className="size-4" aria-hidden="true" />
              Dashboard
            </NavLink>
            <NavLink
              className={cn(buttonVariants({ variant: 'outline' }))}
              onClick={onClose}
              to={routePaths.profile}
            >
              <UserCircle className="size-4" aria-hidden="true" />
              Profile
            </NavLink>
            <NavLink
              className={cn(buttonVariants({ variant: 'outline' }))}
              onClick={onClose}
              to={routePaths.settings}
            >
              <Settings className="size-4" aria-hidden="true" />
              Settings
            </NavLink>
            <button
              className={cn(buttonVariants({ variant: 'ghost' }), 'text-danger')}
              disabled={logout.isPending}
              type="button"
              onClick={() => {
                onClose()
                logout.mutate()
              }}
            >
              <LogOut className="size-4" aria-hidden="true" />
              {logout.isPending ? 'Signing out...' : 'Logout'}
            </button>
          </div>
        ) : (
          <div className="mt-auto grid gap-3 border-t p-5">
            <NavLink
              className={cn(buttonVariants({ variant: 'outline' }))}
              onClick={onClose}
              to={routePaths.login}
            >
              Log in
            </NavLink>
            <NavLink
              className={cn(buttonVariants({ variant: 'primary' }))}
              onClick={onClose}
              to={routePaths.register}
            >
              Sign up
            </NavLink>
          </div>
        )}
      </aside>
    </div>
  )
}
