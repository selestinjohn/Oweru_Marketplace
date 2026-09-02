import type { DashboardActivity } from '@/features/dashboard/types/dashboard.types'
import { ActivityItem } from './ActivityItem'

export function RecentActivityList({
  activities,
}: {
  activities: DashboardActivity[]
}) {
  return (
    <div className="grid gap-3">
      {activities.map((activity) => (
        <ActivityItem activity={activity} key={activity.id} />
      ))}
    </div>
  )
}
