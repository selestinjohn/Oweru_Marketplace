import { AppContainer } from '@/components/common/AppContainer'
import { PageSection } from '@/components/common/PageSection'
import { SectionHeader } from '@/components/common/SectionHeader'
import { propertyCategories } from '@/features/home/data/homeContent'
import { CategoryCard } from './CategoryCard'

export function PropertyCategories() {
  return (
    <PageSection className="bg-surface-muted">
      <AppContainer className="grid gap-6">
        <SectionHeader
          title="Browse by Category"
          description="Move quickly from intent to relevant verified property opportunities."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {propertyCategories.map((category) => (
            <CategoryCard category={category} key={category.title} />
          ))}
        </div>
      </AppContainer>
    </PageSection>
  )
}
