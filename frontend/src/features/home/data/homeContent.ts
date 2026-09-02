import {
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  ClipboardCheck,
  FileCheck2,
  Gavel,
  Handshake,
  Home,
  Landmark,
  MapPinned,
  Scale,
  Search,
  ShieldCheck,
  UserCheck,
  UsersRound,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { propertyImages } from '@/assets/propertyImages'

export type HomeIconContent = {
  description: string
  icon: LucideIcon
  title: string
}

export const homeHeroImage = propertyImages.modernDuplex

export const trustFeatures: HomeIconContent[] = [
  {
    description: 'Evidence-backed property information.',
    icon: ShieldCheck,
    title: 'Verified Properties',
  },
  {
    description: 'Structured workflows for safer commitments.',
    icon: FileCheck2,
    title: 'Secure Transactions',
  },
  {
    description: 'Connect with accountable real-estate experts.',
    icon: UsersRound,
    title: 'Trusted Professionals',
  },
  {
    description: 'Clearer records when issues need attention.',
    icon: Gavel,
    title: 'Dispute Protection',
  },
]

export const featuredPropertyTabs = [
  { id: 'all', label: 'All' },
  { id: 'sale', label: 'For Sale' },
  { id: 'rent', label: 'For Rent' },
  { id: 'land', label: 'Land' },
  { id: 'commercial', label: 'Commercial' },
] as const

export type FeaturedPropertyTabId = (typeof featuredPropertyTabs)[number]['id']

export const propertyCategories = [
  {
    count: '86 available properties',
    href: '/properties?propertyType=house',
    image: propertyImages.modernDuplex,
    title: 'Houses',
  },
  {
    count: '54 rental and sale listings',
    href: '/properties?propertyType=apartment',
    image: propertyImages.apartmentBuilding,
    title: 'Apartments',
  },
  {
    count: '120 verified opportunities',
    href: '/properties?propertyType=land',
    image: propertyImages.coastalLand,
    title: 'Land',
  },
  {
    count: '28 business-ready spaces',
    href: '/properties?propertyType=commercial',
    image: propertyImages.commercialOffice,
    title: 'Commercial',
  },
  {
    count: '42 homes ready to rent',
    href: '/properties?transactionType=rent',
    image: propertyImages.apartmentInterior,
    title: 'Rental Properties',
  },
]

export const verifyTimeline = [
  { label: 'Requested', state: 'complete' },
  { label: 'Assigned', state: 'complete' },
  { label: 'In Progress', state: 'active' },
  { label: 'Submitted', state: 'pending' },
  { label: 'Decision', state: 'pending' },
] as const

export const verifyChecklist = [
  { label: 'Identity Review', status: 'Completed' },
  { label: 'Property Documents', status: 'Completed' },
  { label: 'Property Details', status: 'In Review' },
  { label: 'Physical Inspection', status: 'Scheduled' },
  { label: 'Legal Review', status: 'Pending' },
]

export const workflowSteps: HomeIconContent[] = [
  {
    description:
      'Search verified listings that match your location, budget, and intended use.',
    icon: Search,
    title: 'Discover',
  },
  {
    description:
      'Understand details, documents, and available verification information.',
    icon: ClipboardCheck,
    title: 'Review',
  },
  {
    description:
      'Engage the property owner, agent, or trusted professional from one place.',
    icon: Handshake,
    title: 'Connect',
  },
  {
    description:
      'Move toward the transaction through structured marketplace workflows.',
    icon: Landmark,
    title: 'Transact',
  },
]

export const professionalServices: HomeIconContent[] = [
  {
    description: 'Market guidance, viewing coordination, and listing support.',
    icon: Home,
    title: 'Property Agents',
  },
  {
    description: 'Boundary, land-use, and site information support.',
    icon: MapPinned,
    title: 'Surveyors',
  },
  {
    description:
      'Document review and transaction guidance from qualified professionals.',
    icon: Scale,
    title: 'Legal Professionals',
  },
  {
    description: 'Rental oversight, maintenance coordination, and owner reporting.',
    icon: Building2,
    title: 'Property Managers',
  },
  {
    description: 'Physical condition checks and evidence collection support.',
    icon: BriefcaseBusiness,
    title: 'Inspectors',
  },
]

export const whyOweruPoints: HomeIconContent[] = [
  {
    description: 'Clearer property information and visible verification status.',
    icon: BadgeCheck,
    title: 'Verified Information',
  },
  {
    description: 'Important property and process information presented clearly.',
    icon: ClipboardCheck,
    title: 'Transparency',
  },
  {
    description:
      'Access property participants and professionals through one platform.',
    icon: UserCheck,
    title: 'Trusted Network',
  },
  {
    description:
      'Marketplace workflows designed to reduce fragmented communication.',
    icon: Landmark,
    title: 'Structured Transactions',
  },
  {
    description: 'Important actions and verification stages can be tracked.',
    icon: ShieldCheck,
    title: 'Accountability',
  },
]
