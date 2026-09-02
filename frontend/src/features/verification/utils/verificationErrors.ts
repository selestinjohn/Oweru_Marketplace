import { isAxiosError } from 'axios'

export function verificationActionErrorMessage(error: unknown) {
  if (!isAxiosError(error)) {
    return "We couldn't update the verification. Please try again."
  }

  const status = error.response?.status
  const detail = error.response?.data?.detail

  if (status === 403) {
    return 'You are not authorized to perform this verification action.'
  }

  if (status === 404) {
    return 'Verification not found.'
  }

  if (status === 400) {
    return (
      detail ??
      'This verification can no longer perform that action in its current state.'
    )
  }

  return "OWERU couldn't update the verification right now. Please try again."
}
