import { Download, FileText, LockKeyhole } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/feedback/EmptyState'
import { useSecureDocumentDownload } from '@/features/dashboard/hooks/useSecureDocumentDownload'
import type { SellerDocumentSummary } from '@/features/seller/types/seller.types'
import {
  documentTypeLabel,
  sourceTypeLabel,
} from '@/features/seller/utils/sellerFormat'
import { formatDate } from '@/lib/format'
import { SellerDocumentStatusBadge } from './SellerStatusBadge'

export function SellerDocumentsPanel({
  documents,
  propertyReference,
}: {
  documents: SellerDocumentSummary[]
  propertyReference: string
}) {
  const download = useSecureDocumentDownload()

  if (!documents.length) {
    return (
      <EmptyState
        title="No documents recorded"
        message="Add supporting document metadata to strengthen this OWERU property record before requesting verification."
      />
    )
  }

  return (
    <Card className="p-5">
      <div className="flex items-start gap-3">
        <span className="grid size-10 place-items-center rounded-control bg-accent/10 text-accent">
          <FileText className="size-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">
            Supporting Documents
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Metadata is visible here. Private file storage references remain
            hidden and downloads go through the authorized document API.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        {documents.map((document) => (
          <article
            className="grid gap-4 rounded-control border bg-surface p-4 lg:grid-cols-[1fr_auto] lg:items-center"
            key={document.id}
          >
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <SellerDocumentStatusBadge status={document.status} />
                <Badge tone="muted">{sourceTypeLabel(document.source_type)}</Badge>
              </div>
              <h3 className="mt-3 font-display text-lg font-bold text-foreground">
                {documentTypeLabel(document.document_type)}
              </h3>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {document.description || 'Document metadata recorded.'}
              </p>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                <DocMeta
                  label="Issued"
                  value={document.issued_at ? formatDate(document.issued_at) : 'Not provided'}
                />
                <DocMeta
                  label="Expires"
                  value={document.expires_at ? formatDate(document.expires_at) : 'Not provided'}
                />
                <DocMeta label="Submitted" value={formatDate(document.created_at)} />
              </dl>
            </div>
            <Button
              disabled={download.isPending}
              variant="outline"
              onClick={() =>
                download.mutate({
                  documentId: document.id,
                  fileName: `${propertyReference}-${document.document_type}.pdf`,
                })
              }
            >
              {download.isPending ? (
                <>
                  <LockKeyhole className="size-4" aria-hidden="true" />
                  Preparing...
                </>
              ) : (
                <>
                  <Download className="size-4" aria-hidden="true" />
                  Secure Download
                </>
              )}
            </Button>
          </article>
        ))}
      </div>
    </Card>
  )
}

function DocMeta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-extrabold uppercase text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 font-semibold text-foreground">{value}</dd>
    </div>
  )
}
