import { ChevronLeft, ChevronRight } from 'lucide-react'
import { OutlineButton } from '@/components/ui/Button'

export function PaginationControls({
  currentPage,
  onPageChange,
  totalPages,
}: {
  currentPage: number
  onPageChange: (page: number) => void
  totalPages: number
}) {
  if (totalPages <= 1) {
    return null
  }

  return (
    <nav
      className="flex flex-wrap items-center justify-between gap-3 rounded-card border bg-surface p-3 shadow-sm"
      aria-label="Property listing pagination"
    >
      <OutlineButton
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft className="size-4" aria-hidden="true" />
        Previous
      </OutlineButton>

      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (page) => (
            <button
              className={`grid size-10 place-items-center rounded-control text-sm font-bold transition ${
                page === currentPage
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
              key={page}
              type="button"
              aria-current={page === currentPage ? 'page' : undefined}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          ),
        )}
      </div>

      <OutlineButton
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
        <ChevronRight className="size-4" aria-hidden="true" />
      </OutlineButton>
    </nav>
  )
}
