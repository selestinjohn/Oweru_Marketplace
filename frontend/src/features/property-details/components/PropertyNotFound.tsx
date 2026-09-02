import { Home, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AppContainer } from '@/components/common/AppContainer'
import { PageSection } from '@/components/common/PageSection'
import { buttonVariants } from '@/components/ui/buttonVariants'
import { routePaths } from '@/constants/routes'
import { cn } from '@/lib/utils'

export function PropertyNotFound() {
  return (
    <PageSection className="bg-surface-muted">
      <AppContainer>
        <div className="grid min-h-[440px] place-items-center rounded-card border bg-surface p-8 text-center shadow-panel">
          <div>
            <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-accent/10 text-accent">
              <Search className="size-7" aria-hidden="true" />
            </span>
            <h1 className="mt-5 font-display text-3xl font-bold text-foreground">
              Property not found
            </h1>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              This property may have been removed or the link may be incorrect.
              Browse the marketplace to continue exploring verified
              opportunities.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                className={cn(buttonVariants({ variant: 'primary' }))}
                to={routePaths.properties}
              >
                Browse Properties
              </Link>
              <Link
                className={cn(buttonVariants({ variant: 'outline' }))}
                to={routePaths.home}
              >
                <Home className="size-4" aria-hidden="true" />
                Go Home
              </Link>
            </div>
          </div>
        </div>
      </AppContainer>
    </PageSection>
  )
}
