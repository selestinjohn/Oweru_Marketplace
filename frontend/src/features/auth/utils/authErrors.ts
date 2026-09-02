import type { AxiosError } from 'axios'
import type { ApiErrorPayload } from '@/types/api'
import type { NormalizedAuthError } from '@/features/auth/types/auth.types'

type ErrorRecord = Record<string, unknown>

const FIELD_NAME_MAP: Record<string, string> = {
  display_name: 'displayName',
  phone_number: 'phoneNumber',
  non_field_errors: 'root',
}

export function normalizeAuthError(
  error: unknown,
  fallback = 'OWERU is temporarily unavailable. Please try again.',
): NormalizedAuthError {
  const axiosError = error as AxiosError<ApiErrorPayload & ErrorRecord>
  const payload = axiosError.response?.data
  const details = payload?.error?.details ?? payload
  const fieldErrors = extractFieldErrors(details)
  const formError =
    readString(payload?.detail) ??
    readString(payload?.error?.message) ??
    fieldErrors.root ??
    axiosError.message ??
    fallback

  delete fieldErrors.root

  return {
    code: payload?.error?.code,
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
