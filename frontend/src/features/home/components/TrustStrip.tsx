import { AppContainer } from '@/components/common/AppContainer'
import { Card } from '@/components/ui/Card'
import { trustFeatures } from '@/features/home/data/homeContent'
import { TrustFeature } from './TrustFeature'

export function TrustStrip() {
  return (
    <section className="relative z-10 bg-surface pb-7">
      <AppContainer className="-mt-8">
        <Card className="grid overflow-hidden divide-y p-0 md:grid-cols-2 md:divide-x md:divide-y-0 xl:grid-cols-4">
          {trustFeatures.map((feature) => (
            <TrustFeature feature={feature} key={feature.title} />
          ))}
        </Card>
      </AppContainer>
    </section>
  )
}
