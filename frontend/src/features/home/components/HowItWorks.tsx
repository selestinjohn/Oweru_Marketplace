import { AppContainer } from '@/components/common/AppContainer'
import { PageSection } from '@/components/common/PageSection'
import { SectionHeader } from '@/components/common/SectionHeader'
import { workflowSteps } from '@/features/home/data/homeContent'
import { HowItWorksStep } from './HowItWorksStep'

export function HowItWorks() {
  return (
    <PageSection className="bg-surface" id="how-it-works">
      <AppContainer className="grid gap-6">
        <SectionHeader
          title="How OWERU Works"
          description="A clearer journey from property discovery to safer transaction preparation."
        />

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {workflowSteps.map((step, index) => (
            <HowItWorksStep
              key={step.title}
              step={step}
              stepNumber={String(index + 1).padStart(2, '0')}
            />
          ))}
        </div>
      </AppContainer>
    </PageSection>
  )
}
