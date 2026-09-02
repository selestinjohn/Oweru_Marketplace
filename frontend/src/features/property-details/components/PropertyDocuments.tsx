import { Card } from '@/components/ui/Card'
import type { PropertyDetails } from '@/types/property'
import { DocumentCard } from './DocumentCard'

export function PropertyDocuments({ property }: { property: PropertyDetails }) {
  return (
    <Card className="p-5">
      <h2 className="font-display text-2xl font-bold text-foreground">
        Documents
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
        Public users can review document metadata only. Direct downloads,
        private storage paths, and sensitive records remain restricted until the
        backend authorizes access.
      </p>

      <div className="mt-5 grid gap-3">
        {property.documents.map((document) => (
          <DocumentCard document={document} key={document.id} />
        ))}
      </div>
    </Card>
  )
}
