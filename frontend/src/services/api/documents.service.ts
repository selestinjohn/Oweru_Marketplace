import { apiEndpoints } from './endpoints'
import { httpClient } from './httpClient'
import type { ID, PaginatedResponse } from '@/types/api'

export type PropertyDocument = {
  id: ID
  propertyId: ID
  title: string
  documentType: string
  status: string
  createdAt: string
}

export const documentsService = {
  async list() {
    const response = await httpClient.get<PaginatedResponse<PropertyDocument>>(
      apiEndpoints.documents.list,
    )
    return response.data
  },

  async detail(documentId: string) {
    const response = await httpClient.get<PropertyDocument>(
      apiEndpoints.documents.detail(documentId),
    )
    return response.data
  },

  async download(documentId: string) {
    const response = await httpClient.get<Blob>(
      apiEndpoints.documents.download(documentId),
      {
        responseType: 'blob',
      },
    )
    return response.data
  },
}
