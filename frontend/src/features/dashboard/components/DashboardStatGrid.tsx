import { StatCard } from '@/components/common/StatCard'
import type { DashboardStat } from '@/features/dashboard/types/dashboard.types'

export function DashboardStatGrid({ stats }: { stats: DashboardStat[] }) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <StatCard
          context={stat.context}
          icon={stat.icon}
          key={stat.id}
          label={stat.label}
          tone={stat.tone}
          value={stat.value}
        />
      ))}
    </section>
  )
}
