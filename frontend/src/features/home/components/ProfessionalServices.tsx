import { ArrowRight } from 'lucide-react'
import { AppContainer } from '@/components/common/AppContainer'
import { PageSection } from '@/components/common/PageSection'
import { SectionHeader } from '@/components/common/SectionHeader'
import { buttonVariants } from '@/components/ui/buttonVariants'
import { professionalServices } from '@/features/home/data/homeContent'
import { cn } from '@/lib/utils'
import { ServiceCard } from './ServiceCard'

export function ProfessionalServices() {
  return (
    <PageSection className="bg-surface-muted" id="services">
      <AppContainer className="grid gap-6">
        <SectionHeader
          title="Trusted Professionals"
          description="Find the right support around property search, verification, and transaction preparation."
          action={
            <a
              className={cn(buttonVariants({ variant: 'outline' }), 'shrink-0')}
              href="#cta"
            >
              Explore Services
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          }
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {professionalServices.map((service) => (
            <ServiceCard key={service.title} service={service} />
          ))}
        </div>
      </AppContainer>
    </PageSection>
  )
}
