import type { AxiosError } from 'axios'
import { apiEndpoints } from '@/services/api/endpoints'
import { httpClient } from '@/services/api/httpClient'
import type { ApiErrorPayload, ID, PaginatedResponse } from '@/types/api'
import type {
  CreateDocumentPayload,
  CreateListingPayload,
  CreatePropertyPayload,
  ListingWorkflowAction,
  SellerDocumentSummary,
  SellerListing,
  SellerPropertyRecord,
  UpdateListingPayload,
  UpdatePropertyPayload,
} from '@/features/seller/types/seller.types'

type ErrorRecord = Record<string, unknown>

export type BackendPropertyResponse = Omit<SellerPropertyRecord, 'image'>

export type NormalizedSellerError = {
  fieldErrors: Record<string, string>
  formError: string
}

const FIELD_NAME_MAP: Record<string, string> = {
  document_type: 'documentType',
  expires_at: 'expiresAt',
  issued_at: 'issuedAt',
  location_description: 'locationDescription',
  non_field_errors: 'root',
  ownership_basis: 'ownershipBasis',
  property_type: 'propertyType',
  reference_number: 'referenceNumber',
}

export const sellerApi = {
  async createProperty(payload: CreatePropertyPayload) {
    const response = await httpClient.post<BackendPropertyResponse>(
      apiEndpoints.properties.create,
      payload,
    )
    return response.data
  },

  async updateProperty(_propertyId: ID, _payload: UpdatePropertyPayload) {
    throw new Error(
      'Property update is pending a PATCH endpoint in the current backend.',
    )
  },

  async listMineListings() {
    const response = await httpClient.get<
      PaginatedResponse<SellerListing> | SellerListing[]
    >(apiEndpoints.listings.mine)
    return Array.isArray(response.data) ? response.data : response.data.results
  },

  async createListing(payload: CreateListingPayload) {
    const response = await httpClient.post<SellerListing>(
      apiEndpoints.listings.create,
      payload,
    )
    return response.data
  },

  async updateListing(_listingId: ID, _payload: UpdateListingPayload) {
    throw new Error(
      'Listing metadata update is pending a PATCH endpoint in the current backend.',
    )
  },

  async transitionListing(listingId: ID, action: ListingWorkflowAction) {
    const endpoint = {
      close: apiEndpoints.listings.close,
      pause: apiEndpoints.listings.pause,
      publish: apiEndpoints.listings.publish,
      resume: apiEndpoints.listings.resume,
    }[action](listingId)
    const response = await httpClient.post<SellerListing>(endpoint)
    return response.data
  },

  async createDocument(payload: CreateDocumentPayload) {
    const formData = new FormData()
    formData.append('property', payload.property)
    formData.append('document_type', payload.document_type)
    formData.append('source_type', payload.source_type)
    formData.append('file', payload.file)

    if (payload.description) {
      formData.append('description', payload.description)
    }

    if (payload.issued_at) {
      formData.append('issued_at', payload.issued_at)
    }

    if (payload.expires_at) {
      formData.append('expires_at', payload.expires_at)
    }

    const response = await httpClient.post<SellerDocumentSummary>(
      apiEndpoints.documents.create,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )
    return response.data
  },

  secureDocumentDownloadUrl(documentId: ID) {
    return apiEndpoints.documents.download(documentId)
  },
}

export function normalizeSellerError(
  error: unknown,
  fallback = 'OWERU could not complete this seller action. Please try again.',
): NormalizedSellerError {
  const axiosError = error as AxiosError<ApiErrorPayload & ErrorRecord>
  const payload = axiosError.response?.data
  const details = payload?.error?.details ?? payload
  const fieldErrors = extractFieldErrors(details)
  const formError =
    readString(payload?.detail) ??
    readString(payload?.error?.message) ??
    fieldErrors.root ??
    (axiosError.response?.status === 403
      ? "You don't have permission to manage this resource."
      : undefined) ??
    (axiosError.response?.status === 404
      ? 'This seller resource could not be found.'
      : undefined) ??
    axiosError.message ??
    fallback

  delete fieldErrors.root

  return {
    fieldErrors,
    formError,
  }
}

function extractFieldErrors(value: unknown): Record<string, string> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {}
  }

  return Object.entries(value as ErrorRecord).reduce<Record<string, string>>(
    (errors, [rawKey, rawValue]) => {
      const key = FIELD_NAME_MAP[rawKey] ?? rawKey
      const message = readString(rawValue)

      if (message) {
        errors[key] = message
      }

      return errors
    },
    {},
  )
}

function readString(value: unknown): string | undefined {
  if (typeof value === 'string') {
    return value
  }

  if (Array.isArray(value)) {
    return readString(value[0])
  }

  if (value && typeof value === 'object') {
    const record = value as ErrorRecord
    return readString(record.detail) ?? readString(record.message)
  }

  return undefined
}
