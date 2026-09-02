import { AppContainer } from '@/components/common/AppContainer'
import { PageSection } from '@/components/common/PageSection'
import { whyOweruPoints } from '@/features/home/data/homeContent'

export function WhyOweru() {
  return (
    <PageSection className="bg-primary text-primary-foreground" id="why-oweru">
      <AppContainer className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div>
          <p className="mb-3 text-sm font-bold uppercase text-gold">
            Why choose OWERU
          </p>
          <h2 className="max-w-xl font-display text-3xl font-bold leading-tight md:text-4xl">
            Built for real-estate trust, not just property browsing.
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-primary-foreground/74">
            OWERU brings discovery, verification, professionals, and
            transaction preparation into one calmer marketplace experience.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {whyOweruPoints.map((point) => {
            const Icon = point.icon

            return (
              <article
                className="rounded-card border border-primary-foreground/10 bg-primary-foreground/6 p-5"
                key={point.title}
              >
                <span className="flex size-10 items-center justify-center rounded-control border border-gold/25 bg-gold/10 text-gold">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold">
                  {point.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-primary-foreground/68">
                  {point.description}
                </p>
              </article>
            )
          })}
        </div>
      </AppContainer>
    </PageSection>
  )
}
