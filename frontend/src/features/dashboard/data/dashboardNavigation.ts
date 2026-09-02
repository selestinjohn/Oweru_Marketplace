import {
  Bell,
  ClipboardCheck,
  FileText,
  Home,
  Landmark,
  MessageSquare,
  Search,
  Settings,
  ShieldCheck,
  User,
} from 'lucide-react'
import { routePaths } from '@/constants/routes'
import type { CurrentUserResponse } from '@/features/auth/types/auth.types'
import { hasAnyRole } from '@/features/auth/utils/roles'
import type {
  DashboardNavItem,
  DashboardNavSection,
} from '@/features/dashboard/types/dashboard.types'

export const dashboardNavSections: DashboardNavSection[] = [
  {
    label: 'Marketplace',
    items: [
      { label: 'Dashboard', href: routePaths.dashboard, icon: Home },
      {
        label: 'Saved Properties',
        href: routePaths.savedProperties,
        icon: Search,
      },
      { label: 'Messages', href: routePaths.messages, icon: MessageSquare },
      { label: 'Transactions', href: routePaths.transactions, icon: Landmark },
      {
        label: 'Verifications',
        href: routePaths.verifications,
        icon: ShieldCheck,
      },
      {
        label: 'Verification Workspace',
        href: routePaths.verificationWorkspace,
        icon: ClipboardCheck,
        roles: ['VERIFIER', 'ADMIN', 'OPERATIONS'],
      },
      { label: 'Documents', href: routePaths.documents, icon: FileText },
    ],
  },
  {
    label: 'Account',
    items: [
      { label: 'Profile', href: routePaths.profile, icon: User },
      { label: 'Settings', href: routePaths.settings, icon: Settings },
    ],
  },
]

export const notificationNavItem: DashboardNavItem = {
  label: 'Notifications',
  href: routePaths.dashboard,
  icon: Bell,
}

export const flatDashboardNavigation = dashboardNavSections.flatMap(
  (section) => section.items,
)

export function getDashboardNavSections(
  currentUser: CurrentUserResponse | null,
) {
  return dashboardNavSections
    .map((section) => ({
      ...section,
      items: section.items.filter(
        (item) => !item.roles || hasAnyRole(currentUser, item.roles),
      ),
    }))
    .filter((section) => section.items.length > 0)
}

export function getFlatDashboardNavigation(
  currentUser: CurrentUserResponse | null,
) {
  return getDashboardNavSections(currentUser).flatMap((section) => section.items)
}
