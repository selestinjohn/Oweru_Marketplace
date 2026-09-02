import { Menu, Search } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { IconButton } from '@/components/ui/Button'
import { SearchInput } from '@/components/ui/Input'
import { getFlatDashboardNavigation } from '@/features/dashboard/data/dashboardNavigation'
import type { DashboardNotification } from '@/features/dashboard/types/dashboard.types'
import type { CurrentUserResponse } from '@/features/auth/types/auth.types'
import { DashboardNotifications } from './DashboardNotifications'
import { UserMenu } from './UserMenu'

export function DashboardTopbar({
  currentUser,
  isLoggingOut,
  notifications,
  onLogout,
  onOpenMenu,
}: {
  currentUser: CurrentUserResponse | null
  isLoggingOut: boolean
  notifications: DashboardNotification[]
  onLogout: () => void
  onOpenMenu: () => void
}) {
  const location = useLocation()
  const title = titleForPath(location.pathname, currentUser)

  return (
    <header className="sticky top-0 z-30 border-b bg-surface/95 backdrop-blur-xl">
      <div className="flex min-h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <IconButton
            className="lg:hidden"
            label="Open dashboard navigation"
            variant="outline"
            onClick={onOpenMenu}
          >
            <Menu className="size-5" aria-hidden="true" />
          </IconButton>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase text-accent">
              Buyer workspace
            </p>
            <h1 className="truncate font-display text-xl font-bold text-foreground">
              {title}
            </h1>
          </div>
        </div>

        <div className="hidden w-full max-w-sm md:block">
          <SearchInput
            aria-label="Search dashboard"
            className="min-h-10"
            placeholder="Search activity or property..."
          />
        </div>

        <div className="flex items-center gap-2">
          <IconButton
            className="hidden sm:inline-flex md:hidden"
            label="Search dashboard"
            variant="outline"
          >
            <Search className="size-5" aria-hidden="true" />
          </IconButton>
          <DashboardNotifications notifications={notifications} />
          <UserMenu
            currentUser={currentUser}
            isLoggingOut={isLoggingOut}
            onLogout={onLogout}
          />
        </div>
      </div>
    </header>
  )
}

function titleForPath(
  pathname: string,
  currentUser: CurrentUserResponse | null,
) {
  const items = getFlatDashboardNavigation(currentUser)
  const match = items.find((item) => item.href === pathname)

  return match?.label ?? 'Dashboard'
}
