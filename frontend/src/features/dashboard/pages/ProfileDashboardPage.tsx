import type { LucideIcon } from 'lucide-react'
import { BadgeCheck, Mail, Phone, ShieldCheck } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { useAuth } from '@/app/providers/authContext'
import { DashboardPageHeader } from '@/features/dashboard/components/DashboardPageHeader'
import { formatRoleLabel } from '@/features/dashboard/utils/dashboardFormat'
import { formatDate, titleCase } from '@/lib/format'

export function ProfileDashboardPage() {
  const { party, roles, user } = useAuth()

  return (
    <div className="grid gap-6">
      <DashboardPageHeader
        eyebrow="Profile"
        title="Identity and preferences"
        description="Your profile keeps the User, Party, and role model visible without exposing sensitive backend-only data."
      />

      <section className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="p-5">
          <div className="flex items-start gap-4">
            <span className="grid size-14 place-items-center rounded-control bg-primary text-lg font-extrabold text-primary-foreground">
              {initialsFor(party?.display_name ?? user?.email ?? 'OWERU')}
            </span>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase text-accent">
                OWERU Party
              </p>
              <h2 className="mt-1 truncate font-display text-2xl font-bold text-foreground">
                {party?.display_name ?? 'Display name not available'}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {party ? titleCase(party.party_type) : 'Party profile pending'}
              </p>
            </div>
          </div>

          <dl className="mt-6 grid gap-3">
            <ProfileRow
              icon={Mail}
              label="Email"
              value={user?.email ?? 'No email on file'}
            />
            <ProfileRow
              icon={Phone}
              label="Phone"
              value={user?.phone_number ?? 'No phone number on file'}
            />
            <ProfileRow
              icon={BadgeCheck}
              label="Account status"
              value={user?.status ? titleCase(user.status) : 'Unknown'}
            />
            <ProfileRow
              icon={ShieldCheck}
              label="Identity status"
              value={
                party?.identity_status
                  ? titleCase(party.identity_status)
                  : 'Pending'
              }
            />
          </dl>
        </Card>

        <Card className="p-5">
          <p className="text-xs font-bold uppercase text-accent">
            Roles and permissions
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold text-foreground">
            Marketplace access
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            A Party may hold multiple roles. Frontend role display improves
            navigation; Django remains responsible for authorization.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {roles.length ? (
              roles.map((role) => (
                <Badge tone="gold" key={role}>
                  {formatRoleLabel(role)}
                </Badge>
              ))
            ) : (
              <Badge tone="muted">No active roles</Badge>
            )}
          </div>

          <dl className="mt-6 grid gap-3 rounded-card border bg-surface-muted p-4">
            <div>
              <dt className="text-xs font-bold uppercase text-muted-foreground">
                Active roles
              </dt>
              <dd className="mt-1 text-sm font-semibold text-foreground">
                {roles.length || 'No'} role{roles.length === 1 ? '' : 's'} on
                this Party
              </dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase text-muted-foreground">
                Joined
              </dt>
              <dd className="mt-1 text-sm font-semibold text-foreground">
                {user?.date_joined ? formatDate(user.date_joined) : 'Unknown'}
              </dd>
            </div>
          </dl>
        </Card>
      </section>
    </div>
  )
}

function ProfileRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-control border bg-surface px-3 py-3">
      <Icon className="size-4 text-accent" aria-hidden="true" />
      <dt className="sr-only">{label}</dt>
      <dd>
        <p className="text-xs font-bold uppercase text-muted-foreground">
          {label}
        </p>
        <p className="text-sm font-semibold text-foreground">{value}</p>
      </dd>
    </div>
  )
}

function initialsFor(value: string) {
  const [first, second] = value.trim().split(/\s+/)
  return `${first?.[0] ?? 'O'}${second?.[0] ?? 'W'}`.toUpperCase()
}
