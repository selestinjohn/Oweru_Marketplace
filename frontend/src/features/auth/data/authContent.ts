import {
  BriefcaseBusiness,
  Building2,
  Compass,
  FileCheck2,
  ShieldCheck,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { propertyImages } from '@/assets/propertyImages'
import { routePaths } from '@/constants/routes'

export const authVisualImage = propertyImages.apartmentInterior

export const authTrustPoints = [
  'Verified property context',
  'Secure marketplace access',
  'Structured transaction records',
]

export type OnboardingIntent = {
  description: string
  icon: LucideIcon
  label: string
  status: 'available' | 'coming-soon'
  to?: string
}

export const onboardingIntents: OnboardingIntent[] = [
  {
    description: 'Search verified Tanzanian listings and save opportunities.',
    icon: Compass,
    label: 'Explore properties',
    status: 'available',
    to: routePaths.properties,
  },
  {
    description: 'Prepare a property listing workspace for seller review.',
    icon: Building2,
    label: 'List a property',
    status: 'coming-soon',
  },
  {
    description: 'Track inquiries, documents, and future transaction activity.',
    icon: FileCheck2,
    label: 'Manage properties',
    status: 'available',
    to: routePaths.dashboard,
  },
  {
    description: 'Prepare a professional profile for agent or verifier review.',
    icon: BriefcaseBusiness,
    label: 'Offer professional services',
    status: 'coming-soon',
  },
  {
    description: 'Understand how OWERU verification supports informed decisions.',
    icon: ShieldCheck,
    label: 'Learn about verification',
    status: 'available',
    to: `${routePaths.home}#verify`,
  },
]
