import { Download, FileText, LockKeyhole } from 'lucide-react'
import { EmptyState } from '@/components/feedback/EmptyState'
import { OutlineButton } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { DashboardPageHeader } from '@/features/dashboard/components/DashboardPageHeader'
import { DashboardStatusBadge } from '@/features/dashboard/components/DashboardStatusBadge'
import { useDashboardOverview } from '@/features/dashboard/hooks/useDashboardOverview'
import { useSecureDocumentDownload } from '@/features/dashboard/hooks/useSecureDocumentDownload'
import type { DashboardDocument } from '@/features/dashboard/types/dashboard.types'
import {
  formatDocumentType,
  formatSourceType,
} from '@/features/dashboard/utils/dashboardFormat'
import { formatDate } from '@/lib/format'

export function DocumentsDashboardPage() {
  const documents = useDashboardOverview().data?.documents ?? []
  const downloadDocument = useSecureDocumentDownload()

  return (
    <div className="grid gap-6">
      <DashboardPageHeader
        eyebrow="Documents"
        title="Document metadata"
        description="Review document status and source information without exposing private storage paths."
      />

      {!documents.length ? (
        <EmptyState
          title="No documents yet"
          message="Document metadata will appear here when you request or participate in authorized property due diligence."
        />
      ) : (
        <section className="grid gap-3">
          {downloadDocument.isError && (
            <p
              className="rounded-control border border-danger/20 bg-danger/8 px-4 py-3 text-sm font-semibold text-danger"
              role="alert"
            >
              Secure document download is unavailable right now. Please try
              again after your document access is confirmed.
            </p>
          )}

          {documents.map((document) => (
            <DocumentMetadataRow
              document={document}
              downloadDocument={downloadDocument}
              key={document.id}
            />
          ))}
        </section>
      )}
    </div>
  )
}

function DocumentMetadataRow({
  document,
  downloadDocument,
}: {
  document: DashboardDocument
  downloadDocument: ReturnType<typeof useSecureDocumentDownload>
}) {
  const documentType = formatDocumentType(document.documentType)
  const isDownloading =
    downloadDocument.isPending &&
    downloadDocument.variables?.documentId === document.id

  return (
    <Card className="grid gap-4 p-4 lg:grid-cols-[1fr_auto_auto] lg:items-center">
      <div className="flex gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-control bg-primary/8 text-primary">
          <FileText className="size-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-display text-lg font-bold text-foreground">
            {documentType}
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {document.propertyTitle} · {formatSourceType(document.source)} ·
            {' '}Recorded {formatDate(document.recordedDate)}
          </p>
        </div>
      </div>
      <DashboardStatusBadge kind="document" status={document.status} />
      <OutlineButton
        aria-label={
          document.canDownload
            ? `Download ${documentType} through the secure OWERU document endpoint`
            : `${documentType} is restricted`
        }
        disabled={!document.canDownload || isDownloading}
        onClick={() =>
          downloadDocument.mutate({
            documentId: document.id,
            fileName: `OWERU-${document.id}-${documentType}`,
          })
        }
        size="sm"
      >
        {!document.canDownload ? (
          <LockKeyhole className="size-4" aria-hidden="true" />
        ) : (
          <Download className="size-4" aria-hidden="true" />
        )}
        {isDownloading
          ? 'Preparing...'
          : document.canDownload
            ? 'Download'
            : 'Restricted'}
      </OutlineButton>
    </Card>
  )
}
