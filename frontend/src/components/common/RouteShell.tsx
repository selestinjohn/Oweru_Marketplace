import type { ReactNode } from 'react'
import { AppContainer } from './AppContainer'
import { PageHeader } from './PageHeader'
import { PageSection } from './PageSection'
import { usePageTitle } from '@/hooks/usePageTitle'

export function RouteShell({
  children,
  description,
  eyebrow,
  title,
}: {
  children?: ReactNode
  description: string
  eyebrow: string
  title: string
}) {
  usePageTitle(title)

  return (
    <PageSection>
      <AppContainer>
        <div className="rounded-card border bg-card p-6 shadow-panel">
          <PageHeader
            description={description}
            eyebrow={eyebrow}
            title={title}
          />
          {children && <div className="mt-6">{children}</div>}
        </div>
      </AppContainer>
    </PageSection>
  )
}
