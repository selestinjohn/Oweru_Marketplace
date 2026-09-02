import { ImageIcon, Images, X } from 'lucide-react'
import { useState } from 'react'
import { IconButton } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import type { PropertyDetails, PropertyImage } from '@/types/property'

function GalleryImage({
  image,
  onSelect,
  selected,
}: {
  image: PropertyImage
  onSelect: () => void
  selected?: boolean
}) {
  return (
    <button
      className={cn(
        'relative overflow-hidden rounded-card border bg-muted text-left transition hover:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        selected && 'border-accent ring-2 ring-accent/20',
      )}
      onClick={onSelect}
      type="button"
    >
      <img
        className="h-full w-full object-cover"
        src={image.url}
        alt={image.alt}
        loading="lazy"
        decoding="async"
      />
    </button>
  )
}

export function PropertyGallery({ property }: { property: PropertyDetails }) {
  const [activeImage, setActiveImage] = useState(property.images[0])
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const secondaryImages = property.images.slice(1, 5)

  return (
    <section className="grid gap-3" aria-label="Property image gallery">
      <div className="grid gap-3 lg:grid-cols-[1.45fr_0.9fr]">
        <button
          className="group relative min-h-[320px] overflow-hidden rounded-card border bg-muted text-left shadow-panel md:min-h-[460px]"
          onClick={() => setIsLightboxOpen(true)}
          type="button"
        >
          {activeImage ? (
            <img
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
              src={activeImage.url}
              alt={activeImage.alt}
              decoding="async"
            />
          ) : (
            <span className="grid h-full min-h-[320px] place-items-center text-muted-foreground">
              <ImageIcon className="size-8" aria-hidden="true" />
            </span>
          )}
          <span className="absolute bottom-4 right-4 inline-flex min-h-10 items-center gap-2 rounded-control bg-primary/82 px-3 text-sm font-bold text-primary-foreground backdrop-blur-sm">
            <Images className="size-4" aria-hidden="true" />
            View all {property.images.length} photos
          </span>
        </button>

        <div className="grid grid-cols-2 gap-3">
          {secondaryImages.map((image) => (
            <GalleryImage
              image={image}
              key={image.id}
              onSelect={() => setActiveImage(image)}
              selected={activeImage?.id === image.id}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1">
        {property.images.map((image) => (
          <button
            className={cn(
              'h-20 w-28 shrink-0 overflow-hidden rounded-control border bg-muted transition hover:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
              activeImage?.id === image.id && 'border-accent ring-2 ring-accent/20',
            )}
            key={image.id}
            onClick={() => setActiveImage(image)}
            type="button"
          >
            <img
              className="h-full w-full object-cover"
              src={image.url}
              alt={image.alt}
              loading="lazy"
              decoding="async"
            />
          </button>
        ))}
      </div>

      {isLightboxOpen && activeImage && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-primary/88 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Property image preview"
        >
          <div className="relative w-full max-w-5xl overflow-hidden rounded-card border border-primary-foreground/12 bg-primary shadow-soft">
            <img
              className="max-h-[80svh] w-full object-contain"
              src={activeImage.url}
              alt={activeImage.alt}
            />
            <IconButton
              className="absolute right-4 top-4 bg-surface text-foreground"
              label="Close image preview"
              onClick={() => setIsLightboxOpen(false)}
              variant="outline"
            >
              <X className="size-5" aria-hidden="true" />
            </IconButton>
          </div>
        </div>
      )}
    </section>
  )
}
