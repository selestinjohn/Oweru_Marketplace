import { Outlet } from 'react-router-dom'
import { TopNavigation } from '@/components/navigation/TopNavigation'

export function PublicLayout() {
  return (
    <div className="min-h-screen">
      <TopNavigation />
      <main id="main-content">
        <Outlet />
      </main>
    </div>
  )
}
