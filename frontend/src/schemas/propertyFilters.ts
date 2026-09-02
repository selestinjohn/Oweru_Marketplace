import { z } from 'zod'

export const propertyFiltersSchema = z.object({
  propertyType: z.string().optional(),
  transactionType: z.string().optional(),
  location: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  bedrooms: z.coerce.number().optional(),
  minSize: z.coerce.number().optional(),
  maxSize: z.coerce.number().optional(),
})

export type PropertyFiltersFormValues = z.infer<typeof propertyFiltersSchema>
