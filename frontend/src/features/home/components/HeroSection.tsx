import { BadgeCheck, ShieldCheck } from 'lucide-react'
import { AppContainer } from '@/components/common/AppContainer'
import { homeHeroImage } from '@/features/home/data/homeContent'
import { HeroSearch } from './HeroSearch'

export function HeroSection() {
  return (
    <section className="bg-surface pt-5 md:pt-7">
      <AppContainer>
        <div className="relative isolate min-h-[560px] overflow-hidden rounded-card border bg-primary shadow-soft md:min-h-[600px]">
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src={homeHeroImage}
            alt="Premium modern home representing verified property discovery"
            decoding="async"
          />
          <div className="absolute inset-0 bg-primary/65" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-primary/20" />

          <div className="relative flex min-h-[560px] items-end p-5 md:min-h-[600px] md:p-10 lg:p-14">
            <div className="w-full max-w-4xl">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary-foreground/15 bg-primary-foreground/10 px-3 py-1 text-xs font-bold uppercase tracking-normal text-gold">
                <ShieldCheck className="size-4" aria-hidden="true" />
                OWERU Marketplace
              </p>
              <h1 className="max-w-3xl font-display text-4xl font-bold leading-[1.04] text-primary-foreground sm:text-5xl lg:text-6xl">
                Find. Verify. Transact.{' '}
                <span className="block text-primary-foreground">
                  With Confidence.
                </span>
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-primary-foreground/82 md:text-lg">
                Discover verified properties, trusted professionals, and a
                clearer path toward secure real-estate transactions across
                Tanzania.
              </p>

              <div className="mt-8 max-w-3xl">
                <HeroSearch />
              </div>

              <div className="mt-6 flex flex-wrap gap-2 text-sm font-semibold text-primary-foreground/88">
                <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/15 bg-primary-foreground/10 px-3 py-2">
                  <BadgeCheck className="size-4 text-gold" aria-hidden="true" />
                  Verified listings
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/15 bg-primary-foreground/10 px-3 py-2">
                  <BadgeCheck className="size-4 text-gold" aria-hidden="true" />
                  Clear status signals
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/15 bg-primary-foreground/10 px-3 py-2">
                  <BadgeCheck className="size-4 text-gold" aria-hidden="true" />
                  Transaction-ready support
                </span>
              </div>
            </div>
          </div>
        </div>
      </AppContainer>
    </section>
  )
}
