import { UsersRound } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import type { SellerParticipantSummary } from '@/features/seller/types/seller.types'
import {
  relationshipLabel,
  sourceTypeLabel,
} from '@/features/seller/utils/sellerFormat'
import { formatDate } from '@/lib/format'

export function PropertyParticipants({
  participants,
}: {
  participants: SellerParticipantSummary[]
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start gap-3">
        <span className="grid size-10 place-items-center rounded-control bg-primary/8 text-primary">
          <UsersRound className="size-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">
            Property Participants
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Participants are shown as property relationships, without exposing
            private account details.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        {participants.map((participant) => (
          <article
            className="rounded-control border bg-surface p-4"
            key={participant.id}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-bold text-foreground">
                  {participant.party_display_name}
                </h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {participant.basis || 'Relationship recorded on OWERU.'}
                </p>
              </div>
              <Badge tone="navy">{relationshipLabel(participant.relationship)}</Badge>
            </div>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-xs font-extrabold uppercase text-muted-foreground">
                  Source
                </dt>
                <dd className="mt-1 font-semibold text-foreground">
                  {sourceTypeLabel(participant.source_type)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-extrabold uppercase text-muted-foreground">
                  Started
                </dt>
                <dd className="mt-1 font-semibold text-foreground">
                  {formatDate(participant.started_at)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-extrabold uppercase text-muted-foreground">
                  Ended
                </dt>
                <dd className="mt-1 font-semibold text-foreground">
                  {participant.ended_at
                    ? formatDate(participant.ended_at)
                    : 'Active'}
                </dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </Card>
  )
}
