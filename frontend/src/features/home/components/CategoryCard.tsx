import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

type CategoryCardProps = {
  category: {
    count: string
    href: string
    image: string
    title: string
  }
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      className="group relative isolate min-h-56 overflow-hidden rounded-card border bg-primary shadow-panel transition duration-200 hover:-translate-y-1 hover:shadow-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      to={category.href}
    >
      <img
        className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
        src={category.image}
        alt={`${category.title} property category`}
        decoding="async"
      />
      <div className="absolute inset-0 bg-primary/45" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-primary/5" />
      <div className="relative flex h-full min-h-56 flex-col justify-end p-5 text-primary-foreground">
        <span className="mb-4 inline-flex size-10 items-center justify-center self-end rounded-control border border-primary-foreground/20 bg-primary-foreground/12 text-gold transition group-hover:bg-accent group-hover:text-accent-foreground">
          <ArrowUpRight className="size-5" aria-hidden="true" />
        </span>
        <h3 className="font-display text-2xl font-bold leading-tight">
          {category.title}
        </h3>
        <p className="mt-1 text-sm font-semibold text-primary-foreground/78">
          {category.count}
        </p>
      </div>
    </Link>
  )
}
