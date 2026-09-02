import { NavLink, Outlet } from 'react-router-dom'
import { OweruLogo } from '@/components/navigation/OweruLogo'
import { routePaths } from '@/constants/routes'
import { AuthBrandPanel } from './AuthBrandPanel'

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[0.95fr_1.05fr]">
      <AuthBrandPanel />

      <main
        className="grid min-h-screen place-items-center px-4 py-8 sm:px-6 lg:px-10"
        id="main-content"
      >
        <div className="w-full max-w-[520px]">
          <NavLink
            className="mb-7 inline-flex rounded-control focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent lg:hidden"
            to={routePaths.home}
          >
            <OweruLogo />
          </NavLink>
          <Outlet />
        </div>
      </main>
    </div>
  )
}
