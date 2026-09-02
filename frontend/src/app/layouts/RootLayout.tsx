import { Outlet } from 'react-router-dom'

export function RootLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <a
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-control focus:bg-accent focus:px-4 focus:py-2 focus:font-semibold focus:text-accent-foreground"
        href="#main-content"
      >
        Skip to content
      </a>
      <Outlet />
    </div>
  )
}
