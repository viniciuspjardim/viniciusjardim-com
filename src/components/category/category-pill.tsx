'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'

type CategoryPillProps = {
  slug?: string
  title: string
}

export function CategoryPill({ slug, title }: CategoryPillProps) {
  const { slug: selectedSlugParam } = useParams()

  // Next.js will return an array for params like [[...slug]]
  const selectedSlug = selectedSlugParam?.[0]
  const isSelected = slug === selectedSlug
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
