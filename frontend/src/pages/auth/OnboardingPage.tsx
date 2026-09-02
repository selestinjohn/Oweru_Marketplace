import { ArrowRight, ShieldCheck } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { AppContainer } from '@/components/common/AppContainer'
import { PageSection } from '@/components/common/PageSection'
import { OweruLogo } from '@/components/navigation/OweruLogo'
import { buttonVariants } from '@/components/ui/buttonVariants'
import { onboardingIntents } from '@/features/auth/data/authContent'
import { OnboardingIntentCard } from '@/features/auth/components/OnboardingIntentCard'
import { useAuth } from '@/app/providers/authContext'
import { routePaths } from '@/constants/routes'
import { usePageTitle } from '@/hooks/usePageTitle'
import { cn } from '@/lib/utils'

export function OnboardingPage() {
  usePageTitle('Account onboarding')

  const { party, user } = useAuth()
  const displayName = party?.display_name ?? user?.email ?? 'there'

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-surface">
        <AppContainer className="flex min-h-20 items-center justify-between gap-4">
          <NavLink to={routePaths.home}>
            <OweruLogo />
          </NavLink>
          <NavLink
            className={cn(buttonVariants({ variant: 'outline' }))}
            to={routePaths.dashboard}
          >
            Skip to dashboard
          </NavLink>
        </AppContainer>
      </header>

      <main id="main-content">
        <PageSection>
          <AppContainer className="grid gap-8">
            <section className="rounded-card border bg-primary p-6 text-primary-foreground shadow-soft sm:p-8 lg:p-10">
              <div className="max-w-3xl">
                <p className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/15 bg-primary-foreground/10 px-3 py-1 text-xs font-bold uppercase text-gold">
                  <ShieldCheck className="size-4" aria-hidden="true" />
                  Account ready
                </p>
                <h1 className="mt-5 font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                  Welcome to OWERU, {displayName}.
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-primary-foreground/76">
                  Choose what you want to do first. These choices guide your
                  experience; OWERU backend roles and approvals remain the
                  authority for privileged access.
                </p>
              </div>
            </section>

            <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {onboardingIntents.map((intent) => (
                <OnboardingIntentCard intent={intent} key={intent.label} />
              ))}
            </section>

            <div className="flex flex-wrap items-center justify-between gap-4 rounded-card border bg-card p-5 shadow-panel">
              <div>
                <h2 className="font-display text-xl font-bold text-foreground">
                  Ready to browse now?
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Start with verified listings and return to setup later.
                </p>
              </div>
              <NavLink
                className={cn(buttonVariants({ variant: 'primary' }))}
                to={routePaths.properties}
              >
                Browse properties
                <ArrowRight className="size-4" aria-hidden="true" />
              </NavLink>
            </div>
          </AppContainer>
        </PageSection>
      </main>
    </div>
  )
}
