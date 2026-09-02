import {
  Bell,
  BookmarkCheck,
  Clock3,
  FileCheck2,
  Heart,
  Home,
  Landmark,
  MessageSquare,
  Search,
  ShieldCheck,
} from 'lucide-react'
import { routePaths } from '@/constants/routes'
import { mockProperties } from '@/data/mockProperties'
import type { DashboardOverview } from '@/features/dashboard/types/dashboard.types'

const detailPath = (propertyId: string) =>
  routePaths.propertyDetail.replace(':propertyId', propertyId)

const verificationPath = (verificationId: string) =>
  routePaths.verificationDetail.replace(':verificationId', verificationId)

export const mockDashboardOverview: DashboardOverview = {
  stats: [
    {
      context: '3 added this month',
      icon: Heart,
      id: 'saved-properties',
      label: 'Saved Properties',
      tone: 'gold',
      value: '12',
    },
    {
      context: '2 awaiting replies',
      icon: MessageSquare,
      id: 'active-inquiries',
      label: 'Active Inquiries',
      tone: 'navy',
      value: '5',
    },
    {
      context: '1 updated recently',
      icon: ShieldCheck,
      id: 'pending-verifications',
      label: 'Pending Verifications',
      tone: 'warning',
      value: '2',
    },
    {
      context: 'Offer accepted',
      icon: Landmark,
      id: 'active-transactions',
      label: 'Active Transactions',
      tone: 'success',
      value: '1',
    },
  ],
  activities: [
    {
      description: 'Masaki, Dar es Salaam',
      href: detailPath('owr-dar-000245'),
      id: 'act-001',
      timestamp: '2 hours ago',
      title: 'You viewed Modern 4 Bedroom Duplex',
      type: 'property_viewed',
    },
    {
      description: 'Kigamboni, Dar es Salaam',
      href: detailPath('owr-pwn-000118'),
      id: 'act-002',
      timestamp: '1 day ago',
      title: 'You saved Premium Residential Plot',
      type: 'property_saved',
    },
    {
      description: 'Property OWR-DAR-000245',
      href: verificationPath('ver-2026-00129'),
      id: 'act-003',
      timestamp: '1 day ago',
      title: 'Your verification request is in progress',
      type: 'verification',
    },
    {
      description: 'A verified agent replied about Mbezi Beach apartment',
      href: routePaths.messages,
      id: 'act-004',
      timestamp: '2 days ago',
      title: 'New message received',
      type: 'message',
    },
    {
      description: 'Modern 4 Bedroom Duplex moved to offer accepted',
      href: routePaths.transactions,
      id: 'act-005',
      timestamp: '3 days ago',
      title: 'Transaction status updated',
      type: 'transaction',
    },
  ],
  recommendedProperties: [
    mockProperties[0],
    mockProperties[4],
    mockProperties[1],
  ],
  savedProperties: [
    {
      note: 'Strong verification record and central location.',
      property: mockProperties[0],
      savedAt: '2026-08-28',
    },
    {
      note: 'Good fit for land comparison around Kigamboni.',
      property: mockProperties[2],
      savedAt: '2026-08-27',
    },
    {
      note: 'Rental option near the coast.',
      property: mockProperties[1],
      savedAt: '2026-08-22',
    },
    {
      note: 'Shortlisted for family relocation.',
      property: mockProperties[10],
      savedAt: '2026-08-20',
    },
  ],
  verifications: [
    {
      href: verificationPath('ver-2026-00129'),
      id: 'ver-2026-00129',
      lastUpdate: 'Today',
      propertyId: 'owr-dar-000245',
      propertyTitle: 'Modern 4 Bedroom Duplex',
      requestedDate: '2026-08-18',
      status: 'IN_PROGRESS',
    },
    {
      href: verificationPath('ver-2026-00118'),
      id: 'ver-2026-00118',
      lastUpdate: '18 August 2026',
      propertyId: 'owr-pwn-000118',
      propertyTitle: 'Premium Residential Plot',
      requestedDate: '2026-08-12',
      status: 'APPROVED',
    },
    {
      href: verificationPath('ver-2026-00141'),
      id: 'ver-2026-00141',
      lastUpdate: 'Yesterday',
      propertyId: 'owr-dar-000316',
      propertyTitle: '2 Bedroom Apartment',
      requestedDate: '2026-08-25',
      status: 'REQUESTED',
    },
  ],
  transactions: [
    {
      actionLabel: 'View transaction',
      id: 'txn-2026-00077',
      lastUpdate: 'Today',
      nextStep: 'Awaiting next step from the seller side.',
      propertyTitle: 'Modern 4 Bedroom Duplex',
      status: 'ACCEPTED',
      transactionType: 'Purchase',
    },
    {
      actionLabel: 'Review offer',
      id: 'txn-2026-00064',
      lastUpdate: '2 days ago',
      nextStep: 'Buyer offer is under negotiation.',
      propertyTitle: '2 Bedroom Apartment',
      status: 'NEGOTIATION',
      transactionType: 'Rental',
    },
  ],
  documents: [
    {
      canDownload: true,
      documentType: 'TITLE',
      id: 'doc-2026-00101',
      propertyTitle: 'Modern 4 Bedroom Duplex',
      recordedDate: '2026-08-16',
      source: 'USER_SUPPLIED',
      status: 'ACCEPTED',
    },
    {
      canDownload: false,
      documentType: 'SURVEY',
      id: 'doc-2026-00102',
      propertyTitle: 'Premium Residential Plot',
      recordedDate: '2026-08-17',
      source: 'AUTHORITY_OBTAINED',
      status: 'UNDER_REVIEW',
    },
    {
      canDownload: false,
      documentType: 'TAX',
      id: 'doc-2026-00103',
      propertyTitle: 'Commercial Office Space',
      recordedDate: '2026-08-10',
      source: 'USER_SUPPLIED',
      status: 'SUBMITTED',
    },
  ],
  conversations: [
    {
      id: 'msg-001',
      lastMessage: 'Viewing slots are available on Thursday afternoon.',
      participant: 'Verified Agent',
      propertyTitle: 'Modern 4 Bedroom Duplex',
      timestamp: '10:30',
      unreadCount: 2,
    },
    {
      id: 'msg-002',
      lastMessage: 'The survey reference has been submitted for review.',
      participant: 'OWERU Support',
      propertyTitle: 'Premium Residential Plot',
      timestamp: 'Yesterday',
      unreadCount: 0,
    },
    {
      id: 'msg-003',
      lastMessage: 'The owner can confirm access details after inspection.',
      participant: 'Property Owner',
      propertyTitle: 'Family Home With Garden',
      timestamp: 'Monday',
      unreadCount: 1,
    },
  ],
  notifications: [
    {
      id: 'note-001',
      message: 'Verification moved to in progress.',
      timestamp: 'Today',
      title: 'Verification update',
    },
    {
      id: 'note-002',
      message: 'A verified agent replied to your inquiry.',
      timestamp: '2 days ago',
      title: 'New message',
    },
    {
      id: 'note-003',
      message: 'A shortlisted property has updated documentation status.',
      timestamp: '3 days ago',
      title: 'Document status',
    },
  ],
}

export const activityIconMap = {
  message: MessageSquare,
  property_saved: BookmarkCheck,
  property_viewed: Search,
  transaction: Landmark,
  verification: ShieldCheck,
} as const

export const quickActions = [
  {
    description: 'Search verified property opportunities across Tanzania.',
    href: routePaths.properties,
    icon: Home,
    label: 'Browse Properties',
  },
  {
    description: 'Return to the properties you want to compare.',
    href: routePaths.savedProperties,
    icon: Heart,
    label: 'View Saved Properties',
  },
  {
    description: 'Follow checks, documents, and verification decisions.',
    href: routePaths.verifications,
    icon: FileCheck2,
    label: 'Track Verification',
  },
  {
    description: 'Review property conversations in one place.',
    href: routePaths.messages,
    icon: Bell,
    label: 'Messages',
  },
]

export const transactionEmptyState = {
  icon: Clock3,
  message:
    "When you begin a property transaction, you'll be able to track its progress here.",
  title: 'No active transactions',
}
