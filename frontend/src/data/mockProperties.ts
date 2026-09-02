import { propertyImages } from '@/assets/propertyImages'
import type {
  PropertyFilters,
  PropertyListing,
  PropertySort,
} from '@/types/property'

export const mockProperties: PropertyListing[] = [
  {
    id: 'owr-dar-000245',
    title: 'Modern 4 Bedroom Duplex',
    location: 'Masaki, Dar es Salaam',
    price: 120_000_000,
    currency: 'TZS',
    propertyType: 'house',
    transactionType: 'sale',
    status: 'available',
    bedrooms: 4,
    bathrooms: 4,
    area: 280,
    image: propertyImages.modernDuplex,
    verified: true,
    verificationState: 'verified',
    listedBy: 'OWERU Verified Agent',
    listedOn: '2026-08-18',
    featured: true,
  },
  {
    id: 'owr-dar-000316',
    title: '2 Bedroom Apartment',
    location: 'Mbezi Beach, Dar es Salaam',
    price: 2_500_000,
    currency: 'TZS',
    propertyType: 'apartment',
    transactionType: 'rent',
    status: 'available',
    bedrooms: 2,
    bathrooms: 2,
    area: 120,
    image: propertyImages.apartmentBuilding,
    verified: true,
    verificationState: 'verified',
    listedBy: 'North Coast Homes',
    listedOn: '2026-08-16',
  },
  {
    id: 'owr-pwn-000118',
    title: 'Premium Residential Plot',
    location: 'Kigamboni, Dar es Salaam',
    price: 18_000_000,
    currency: 'TZS',
    propertyType: 'land',
    transactionType: 'sale',
    status: 'available',
    area: 1_000,
    image: propertyImages.coastalLand,
    verified: true,
    verificationState: 'verified',
    listedBy: 'Coastal Growth Corridor',
    listedOn: '2026-08-12',
  },
  {
    id: 'owr-dar-000401',
    title: 'Commercial Office Space',
    location: 'Upanga, Dar es Salaam',
    price: 35_000_000,
    currency: 'TZS',
    propertyType: 'commercial',
    transactionType: 'sale',
    status: 'available',
    bathrooms: 2,
    area: 200,
    image: propertyImages.commercialOffice,
    verified: true,
    verificationState: 'verified',
    listedBy: 'Oweru Commercial Desk',
    listedOn: '2026-08-10',
  },
  {
    id: 'owr-zan-000072',
    title: 'Beachfront Villa',
    location: 'Kunduchi, Dar es Salaam',
    price: 480_000_000,
    currency: 'TZS',
    propertyType: 'house',
    transactionType: 'sale',
    status: 'available',
    bedrooms: 5,
    bathrooms: 5,
    area: 420,
    image: propertyImages.modernDuplex,
    verified: true,
    verificationState: 'verified',
    listedBy: 'Prime Shoreline Realty',
    listedOn: '2026-08-09',
    featured: true,
  },
  {
    id: 'owr-aru-000133',
    title: '3 Bedroom Bungalow',
    location: 'Njiro, Arusha',
    price: 45_000_000,
    currency: 'TZS',
    propertyType: 'house',
    transactionType: 'sale',
    status: 'available',
    bedrooms: 3,
    bathrooms: 3,
    area: 300,
    image: propertyImages.modernDuplex,
    verified: true,
    verificationState: 'verified',
    listedBy: 'Arusha Land Partner',
    listedOn: '2026-08-08',
  },
  {
    id: 'owr-mza-000099',
    title: 'Warehouse Facility',
    location: 'Ilemela, Mwanza',
    price: 60_000_000,
    currency: 'TZS',
    propertyType: 'warehouse',
    transactionType: 'sale',
    status: 'available',
    bathrooms: 2,
    area: 1_500,
    image: propertyImages.warehouseFacility,
    verified: false,
    verificationState: 'in_review',
    listedBy: 'Lake Zone Logistics',
    listedOn: '2026-08-07',
  },
  {
    id: 'owr-dod-000211',
    title: 'Luxury Apartment',
    location: 'Area D, Dodoma',
    price: 3_200_000,
    currency: 'TZS',
    propertyType: 'apartment',
    transactionType: 'rent',
    status: 'available',
    bedrooms: 3,
    bathrooms: 3,
    area: 160,
    image: propertyImages.apartmentInterior,
    verified: true,
    verificationState: 'verified',
    listedBy: 'Dodoma Executive Homes',
    listedOn: '2026-08-06',
  },
  {
    id: 'owr-aru-000305',
    title: 'Agricultural Land',
    location: 'Ngaramtoni, Arusha',
    price: 76_000_000,
    currency: 'TZS',
    propertyType: 'agricultural',
    transactionType: 'sale',
    status: 'available',
    area: 12_000,
    image: propertyImages.coastalLand,
    verified: false,
    verificationState: 'pending',
    listedBy: 'Northern Highlands Estates',
    listedOn: '2026-08-04',
  },
  {
    id: 'owr-dar-000512',
    title: 'Serviced Studio Apartment',
    location: 'Victoria, Dar es Salaam',
    price: 1_200_000,
    currency: 'TZS',
    propertyType: 'apartment',
    transactionType: 'rent',
    status: 'available',
    bedrooms: 1,
    bathrooms: 1,
    area: 64,
    image: propertyImages.apartmentInterior,
    verified: true,
    verificationState: 'verified',
    listedBy: 'Victoria Rentals',
    listedOn: '2026-08-03',
  },
  {
    id: 'owr-mbe-000614',
    title: 'Family Home With Garden',
    location: 'Mbezi Beach, Dar es Salaam',
    price: 185_000_000,
    currency: 'TZS',
    propertyType: 'house',
    transactionType: 'sale',
    status: 'available',
    bedrooms: 4,
    bathrooms: 3,
    area: 340,
    image: propertyImages.modernDuplex,
    verified: true,
    verificationState: 'verified',
    listedBy: 'North Coast Homes',
    listedOn: '2026-08-02',
  },
  {
    id: 'owr-dod-000711',
    title: 'City Edge Commercial Plot',
    location: 'Nzuguni, Dodoma',
    price: 42_000_000,
    currency: 'TZS',
    propertyType: 'land',
    transactionType: 'sale',
    status: 'available',
    area: 1_800,
    image: propertyImages.coastalLand,
    verified: false,
    verificationState: 'in_review',
    listedBy: 'Central Region Properties',
    listedOn: '2026-07-31',
  },
]

export type MockPropertyResult = {
  items: PropertyListing[]
  total: number
  page: number
  pageSize: number
}

export function getMockProperties({
  filters,
  page,
  pageSize,
  sort,
}: {
  filters: PropertyFilters
  page: number
  pageSize: number
  sort: PropertySort
}): MockPropertyResult {
  const normalizedLocation = filters.location.trim().toLowerCase()
  const minPrice = numericFilter(filters.minPrice)
  const maxPrice = numericFilter(filters.maxPrice)
  const minSize = numericFilter(filters.minSize)
  const maxSize = numericFilter(filters.maxSize)
  const minimumBedrooms =
    filters.bedrooms === 'any' ? undefined : Number(filters.bedrooms)

  const filtered = mockProperties.filter((property) => {
    return (
      (filters.propertyType === 'all' ||
        property.propertyType === filters.propertyType) &&
      (filters.transactionType === 'all' ||
        property.transactionType === filters.transactionType) &&
      (!normalizedLocation ||
        property.location.toLowerCase().includes(normalizedLocation)) &&
      (minPrice === undefined || property.price >= minPrice) &&
      (maxPrice === undefined || property.price <= maxPrice) &&
      (minimumBedrooms === undefined ||
        (property.bedrooms ?? 0) >= minimumBedrooms) &&
      (minSize === undefined || property.area >= minSize) &&
      (maxSize === undefined || property.area <= maxSize)
    )
  })

  const sorted = [...filtered].sort((left, right) => {
    if (sort === 'price-low') {
      return left.price - right.price
    }

    if (sort === 'price-high') {
      return right.price - left.price
    }

    if (sort === 'largest') {
      return right.area - left.area
    }

    return new Date(right.listedOn).getTime() - new Date(left.listedOn).getTime()
  })

  const start = (page - 1) * pageSize

  return {
    items: sorted.slice(start, start + pageSize),
    total: sorted.length,
    page,
    pageSize,
  }
}

function numericFilter(value: string) {
  if (!value.trim()) {
    return undefined
  }

  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}
