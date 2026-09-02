import { useState } from 'react'
import { MessageSquare } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { DashboardPageHeader } from '@/features/dashboard/components/DashboardPageHeader'
import { useDashboardOverview } from '@/features/dashboard/hooks/useDashboardOverview'
import type { DashboardConversation } from '@/features/dashboard/types/dashboard.types'
import { cn } from '@/lib/utils'

export function MessagesDashboardPage() {
  const dashboardQuery = useDashboardOverview()
  const conversations = dashboardQuery.data?.conversations ?? []
  const [selectedId, setSelectedId] = useState(conversations[0]?.id)
  const selected =
    conversations.find((conversation) => conversation.id === selectedId) ??
    conversations[0]

  return (
    <div className="grid gap-6">
      <DashboardPageHeader
        eyebrow="Messages"
        title="Conversations"
        description="A clean foundation for buyer, seller, verifier, support, and agent communication."
      />

      <Card className="grid overflow-hidden p-0 lg:grid-cols-[340px_1fr]">
        <section className="border-b bg-surface-muted p-4 lg:border-b-0 lg:border-r">
          <h2 className="font-display text-lg font-bold text-foreground">
            Conversations
          </h2>
          <div className="mt-4 grid gap-2">
            {conversations.map((conversation) => (
              <ConversationButton
                conversation={conversation}
                isSelected={selected?.id === conversation.id}
                key={conversation.id}
                onClick={() => setSelectedId(conversation.id)}
              />
            ))}
          </div>
        </section>

        <section className="min-h-[420px] p-5">
          {selected ? (
            <div className="grid h-full content-between gap-6">
              <div>
                <p className="text-xs font-bold uppercase text-accent">
                  Selected conversation
                </p>
                <h2 className="mt-2 font-display text-2xl font-bold text-foreground">
                  {selected.participant}
                </h2>
                {selected.propertyTitle && (
                  <p className="mt-1 text-sm font-semibold text-muted-foreground">
                    About {selected.propertyTitle}
                  </p>
                )}
              </div>

              <div className="rounded-card border bg-surface-muted p-5">
                <p className="text-sm leading-6 text-muted-foreground">
                  {selected.lastMessage}
                </p>
                <p className="mt-3 text-xs font-bold uppercase text-muted-foreground">
                  Messaging workflows will connect to backend conversation APIs
                  when available.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid h-full place-items-center text-center">
              <div>
                <MessageSquare className="mx-auto size-10 text-accent" />
                <h2 className="mt-4 font-display text-xl font-bold text-foreground">
                  No conversation selected
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Select a conversation to review its latest context.
                </p>
              </div>
            </div>
          )}
        </section>
      </Card>
    </div>
  )
}

function ConversationButton({
  conversation,
  isSelected,
  onClick,
}: {
  conversation: DashboardConversation
  isSelected: boolean
  onClick: () => void
}) {
  return (
    <button
      className={cn(
        'rounded-control border bg-surface p-3 text-left transition hover:border-accent/35 hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        isSelected && 'border-accent/45 bg-accent/10',
      )}
      type="button"
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-foreground">
            {conversation.participant}
          </p>
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {conversation.propertyTitle ?? 'General support'}
          </p>
        </div>
        {conversation.unreadCount > 0 && (
          <Badge tone="gold">{conversation.unreadCount}</Badge>
        )}
      </div>
      <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">
        {conversation.lastMessage}
      </p>
    </button>
  )
}
