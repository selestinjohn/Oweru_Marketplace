import { ArrowRight, UserPlus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AppContainer } from '@/components/common/AppContainer'
import { PageSection } from '@/components/common/PageSection'
import { buttonVariants } from '@/components/ui/buttonVariants'
import { routePaths } from '@/constants/routes'
import { cn } from '@/lib/utils'

export function HomeCTA() {
  return (
    <PageSection className="bg-surface" id="cta">
      <AppContainer>
        <div className="relative overflow-hidden rounded-card border bg-primary p-6 text-primary-foreground shadow-soft md:p-10">
          <div className="absolute inset-x-0 top-0 h-1 bg-accent" />
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="mb-3 text-sm font-bold uppercase text-gold">
                Start with confidence
              </p>
              <h2 className="font-display text-3xl font-bold leading-tight md:text-4xl">
                Ready to find your next property?
              </h2>
              <p className="mt-3 max-w-2xl text-base leading-7 text-primary-foreground/74">
                Explore verified property opportunities across Tanzania and
                create an account when you are ready to save, inquire, and
                transact with clearer records.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:flex-col lg:flex-row">
              <Link
                className={cn(buttonVariants({ variant: 'primary', size: 'lg' }))}
                to={routePaths.properties}
              >
                Browse Properties
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'lg' }),
                  'border-primary-foreground/20 bg-primary-foreground/8 text-primary-foreground hover:bg-primary-foreground/14',
                )}
                to={routePaths.register}
              >
                <UserPlus className="size-4" aria-hidden="true" />
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </AppContainer>
    </PageSection>
  )
}
