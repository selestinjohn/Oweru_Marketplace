import { X } from 'lucide-react'
import { IconButton } from '@/components/ui/Button'
import type { CurrentUserResponse } from '@/features/auth/types/auth.types'
import { DashboardSidebar } from './DashboardSidebar'

export function DashboardMobileNav({
  currentUser,
  isLoggingOut,
  isOpen,
  onClose,
  onLogout,
}: {
  currentUser: CurrentUserResponse | null
  isLoggingOut: boolean
  isOpen: boolean
  onClose: () => void
  onLogout: () => void
}) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
      <button
        className="absolute inset-0 bg-primary/50 backdrop-blur-sm"
        type="button"
        aria-label="Close dashboard navigation"
        onClick={onClose}
      />
      <div className="absolute left-0 top-0 h-full w-[min(88vw,330px)] shadow-soft">
        <IconButton
          className="absolute right-4 top-4 z-10 border-primary-foreground/20 bg-primary-foreground/8 text-primary-foreground hover:bg-primary-foreground/14"
          label="Close dashboard navigation"
          variant="outline"
          onClick={onClose}
        >
          <X className="size-5" aria-hidden="true" />
        </IconButton>
        <DashboardSidebar
          currentUser={currentUser}
          isLoggingOut={isLoggingOut}
          onLogout={onLogout}
          onNavigate={onClose}
        />
      </div>
    </div>
  )
}
