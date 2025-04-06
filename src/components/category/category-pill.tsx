import Link from 'next/link'

export type CategoryPillProps = {
  selectedSlug?: string
  slug?: string
  title: string
}

export function CategoryPill({ selectedSlug, slug, title }: CategoryPillProps) {
  const isSelected = selectedSlug === slug
  const href = slug ? `/categories/${slug}` : '/categories'

  return (
    <Link
      aria-selected={isSelected}
      className="rounded-full border px-6 py-2 text-left font-semibold transition-all hover:bg-neutral-950 aria-selected:bg-gray-100 aria-selected:text-gray-900"
      href={href}
    >
      {title}
    </Link>
  )
}
