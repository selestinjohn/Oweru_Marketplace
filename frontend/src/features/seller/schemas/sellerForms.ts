import { z } from 'zod'

const optionalCoordinate = (label: string, min: number, max: number) =>
  z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || Number.isFinite(Number(value)), {
      message: `${label} must be a valid number.`,
    })
    .refine(
      (value) => {
        if (!value) {
          return true
        }

        const parsed = Number(value)
        return parsed >= min && parsed <= max
      },
      {
        message: `${label} must be between ${min} and ${max}.`,
      },
    )

export const sellerPropertySchema = z.object({
  description: z
    .string()
    .trim()
    .max(2000, 'Description must be 2,000 characters or less.')
    .optional(),
  latitude: optionalCoordinate('Latitude', -90, 90),
  locationDescription: z
    .string()
    .trim()
    .max(500, 'Location description must be 500 characters or less.')
    .optional(),
  longitude: optionalCoordinate('Longitude', -180, 180),
  ownershipBasis: z
    .string()
    .trim()
    .max(255, 'Ownership basis must be 255 characters or less.')
    .optional(),
  propertyType: z.enum([
    'LAND',
    'HOUSE',
    'APARTMENT',
    'COMMERCIAL',
    'OFFICE',
    'FARM',
    'OTHER',
  ]),
  referenceNumber: z
    .string()
    .trim()
    .min(3, 'Reference number is required.')
    .max(100, 'Reference number must be 100 characters or less.'),
})

export type SellerPropertyFormValues = z.infer<typeof sellerPropertySchema>

export const sellerListingSchema = z.object({
  currency: z
    .string()
    .trim()
    .length(3, 'Currency must use a 3-letter code.')
    .default('TZS'),
  description: z
    .string()
    .trim()
    .min(20, 'Describe the listing clearly for marketplace review.')
    .max(3000, 'Description must be 3,000 characters or less.'),
  price: z
    .string()
    .trim()
    .min(1, 'Price is required.')
    .refine((value) => Number(value) > 0, {
      message: 'Price must be greater than zero.',
    }),
  property: z.string().min(1, 'Select the property record for this listing.'),
  title: z
    .string()
    .trim()
    .min(5, 'Listing title is required.')
    .max(255, 'Listing title must be 255 characters or less.'),
})

export type SellerListingFormValues = z.infer<typeof sellerListingSchema>

export const sellerDocumentSchema = z
  .object({
    description: z
      .string()
      .trim()
      .max(1000, 'Description must be 1,000 characters or less.')
      .optional(),
    documentType: z.enum([
      'TITLE',
      'OWNERSHIP',
      'TAX',
      'IDENTITY',
      'SURVEY',
      'OTHER',
    ]),
    expiresAt: z.string().optional(),
    file: z
      .custom<FileList>()
      .refine((value) => value instanceof FileList && value.length > 0, {
        message: 'Choose a document file to upload.',
      }),
    issuedAt: z.string().optional(),
  })
  .refine(
    (values) => {
      if (!values.issuedAt || !values.expiresAt) {
        return true
      }

      return new Date(values.expiresAt) > new Date(values.issuedAt)
    },
    {
      message: 'Expiry date must be after the issue date.',
      path: ['expiresAt'],
    },
  )

export type SellerDocumentFormValues = z.infer<typeof sellerDocumentSchema>
