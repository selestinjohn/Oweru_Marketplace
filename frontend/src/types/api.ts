export type ApiErrorPayload = {
  detail?: string
  error?: {
    code?: string
    message?: string
    details?: unknown
  }
}

export type PaginatedResponse<T> = {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export type ID = string
