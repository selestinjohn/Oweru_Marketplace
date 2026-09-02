import { isRouteErrorResponse, useRouteError } from 'react-router-dom'
import { ErrorState } from '@/components/feedback/ErrorState'

export function RouteErrorBoundary() {
  const error = useRouteError()
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : 'The requested page could not be loaded.'

  return (
    <main className="mx-auto grid min-h-screen max-w-3xl place-items-center px-4">
      <ErrorState title="Route error" message={message} />
    </main>
  )
}
