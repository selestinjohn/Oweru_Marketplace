import { Bell, LockKeyhole, ShieldCheck, UserCog } from 'lucide-react'
import { Checkbox } from '@/components/ui/Checkbox'
import { Card } from '@/components/ui/Card'
import { DashboardPageHeader } from '@/features/dashboard/components/DashboardPageHeader'

const settingsSections = [
  {
    description: 'Profile, contact and account preference controls.',
    icon: UserCog,
    items: ['Profile updates', 'Contact preferences', 'Account language'],
    title: 'Account',
  },
  {
    description: 'Choose which marketplace updates should reach you.',
    icon: Bell,
    items: ['Property alerts', 'Verification updates', 'Message summaries'],
    title: 'Notifications',
  },
  {
    description: 'Security controls will connect to backend account settings.',
    icon: LockKeyhole,
    items: ['Password updates', 'Session review', 'Device access'],
    title: 'Security',
  },
]

export function SettingsDashboardPage() {
  return (
    <div className="grid gap-6">
      <DashboardPageHeader
        eyebrow="Settings"
        title="Account settings"
        description="A clean foundation for notification, security, and account configuration without inventing unsupported persistence."
      />

      <section className="grid gap-5 lg:grid-cols-3">
        {settingsSections.map((section) => {
          const Icon = section.icon

          return (
            <Card className="p-5" key={section.title}>
              <span className="grid size-11 place-items-center rounded-control bg-accent/10 text-accent">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <h2 className="mt-4 font-display text-xl font-bold text-foreground">
                {section.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {section.description}
              </p>
              <div className="mt-5 grid gap-3">
                {section.items.map((item) => (
                  <Checkbox disabled key={item} label={item} />
                ))}
              </div>
            </Card>
          )
        })}
      </section>

      <Card className="flex flex-col gap-4 border-success/20 bg-success/5 p-5 sm:flex-row sm:items-center">
        <span className="grid size-11 shrink-0 place-items-center rounded-control bg-success/10 text-success">
          <ShieldCheck className="size-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">
            Security authority remains server-side
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            These UI controls are ready for future settings APIs. The current
            frontend does not persist unsupported settings locally.
          </p>
        </div>
      </Card>
    </div>
  )
}
