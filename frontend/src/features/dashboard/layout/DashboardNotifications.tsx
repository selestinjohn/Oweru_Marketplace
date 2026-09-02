import { useState } from 'react'
import { Bell } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { IconButton } from '@/components/ui/Button'
import type { DashboardNotification } from '@/features/dashboard/types/dashboard.types'

export function DashboardNotifications({
  notifications,
}: {
  notifications: DashboardNotification[]
}) {
  const [isOpen, setIsOpen] = useState(false)
  const unreadCount = notifications.length

  return (
    <div className="relative">
      <IconButton
        className="relative"
        label="Open notifications"
        variant="outline"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        onClick={() => setIsOpen((value) => !value)}
      >
        <Bell className="size-5" aria-hidden="true" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-accent text-[10px] font-extrabold text-accent-foreground">
            {unreadCount}
          </span>
        )}
      </IconButton>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-[min(88vw,360px)] rounded-card border bg-card p-2 shadow-soft"
          role="dialog"
          aria-label="Notifications"
        >
          <div className="flex items-center justify-between border-b px-3 py-3">
            <p className="font-display text-base font-bold text-foreground">
              Notifications
            </p>
            <Badge tone="gold">{unreadCount} mock</Badge>
          </div>
          <div className="grid gap-1 py-2">
            {notifications.map((notification) => (
              <article
                className="rounded-control px-3 py-2.5 transition hover:bg-muted"
                key={notification.id}
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-sm font-bold text-foreground">
                    {notification.title}
                  </h2>
                  <span className="shrink-0 text-xs font-semibold text-muted-foreground">
                    {notification.timestamp}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  {notification.message}
                </p>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
