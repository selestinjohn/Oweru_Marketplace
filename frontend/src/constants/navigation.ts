import {
  Building2,
} from 'lucide-react'
import { flatDashboardNavigation } from '@/features/dashboard/data/dashboardNavigation'
import { routePaths } from './routes'

export const publicNavigation = [
  { label: 'Properties', to: routePaths.properties },
  { href: '/#verify', label: 'Verify' },
  { href: '/#services', label: 'Services' },
  { href: '/#how-it-works', label: 'Resources' },
  { href: '/#why-oweru', label: 'About' },
] as const

export const dashboardNavigation = flatDashboardNavigation.map((item) => ({
  icon: item.icon,
  label: item.label,
  to: item.href,
}))

export const futureRoleNavigation = [
  { label: 'My Properties', to: routePaths.properties, icon: Building2 },
] as const
