import type { PropertyFilters, PropertySort } from '@/types/property'

export const defaultPropertyFilters: PropertyFilters = {
  propertyType: 'all',
  transactionType: 'all',
  location: '',
  minPrice: '',
  maxPrice: '',
  bedrooms: 'any',
  minSize: '',
  maxSize: '',
}

export const propertyTypeOptions = [
  { label: 'All Types', value: 'all' },
  { label: 'House', value: 'house' },
  { label: 'Apartment', value: 'apartment' },
  { label: 'Land', value: 'land' },
  { label: 'Commercial', value: 'commercial' },
  { label: 'Warehouse', value: 'warehouse' },
  { label: 'Agricultural', value: 'agricultural' },
] as const

export const transactionTypeOptions = [
  { label: 'All', value: 'all' },
  { label: 'For Sale', value: 'sale' },
  { label: 'For Rent', value: 'rent' },
] as const

export const bedroomOptions = [
  { label: 'Any', value: 'any' },
  { label: '1+', value: '1' },
  { label: '2+', value: '2' },
  { label: '3+', value: '3' },
  { label: '4+', value: '4' },
  { label: '5+', value: '5' },
] as const

export const propertySortOptions: Array<{ label: string; value: PropertySort }> = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-low' },
  { label: 'Price: High to Low', value: 'price-high' },
  { label: 'Largest Size', value: 'largest' },
]

export const propertyPageSize = 6
