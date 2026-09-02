import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useAuth } from '@/app/providers/authContext'
import { useLogout } from '@/features/auth/hooks/useLogout'
import { useDashboardOverview } from '@/features/dashboard/hooks/useDashboardOverview'
import { DashboardMobileNav } from './DashboardMobileNav'
import { DashboardSidebar } from './DashboardSidebar'
import { DashboardTopbar } from './DashboardTopbar'

export function AuthenticatedLayout() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const { currentUser } = useAuth()
  const logout = useLogout()
  const dashboardQuery = useDashboardOverview()
  const notifications = dashboardQuery.data?.notifications ?? []

  const handleLogout = () => logout.mutate()

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[268px_1fr]">
      <div className="hidden lg:block">
        <DashboardSidebar
          currentUser={currentUser}
          isLoggingOut={logout.isPending}
          onLogout={handleLogout}
        />
      </div>

      <DashboardMobileNav
        currentUser={currentUser}
        isLoggingOut={logout.isPending}
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        onLogout={handleLogout}
      />

      <section className="min-w-0">
        <DashboardTopbar
          currentUser={currentUser}
          isLoggingOut={logout.isPending}
          notifications={notifications}
          onLogout={handleLogout}
          onOpenMenu={() => setIsMobileNavOpen(true)}
        />
        <main className="min-w-0 px-4 py-6 sm:px-6 lg:px-8" id="main-content">
          <div className="mx-auto w-full max-w-[1320px]">
            <Outlet />
          </div>
        </main>
      </section>
    </div>
  )
}
