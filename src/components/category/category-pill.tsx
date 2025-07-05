'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'

type CategoryPillProps = {
  slug?: string
  title: string
}

export function CategoryPill({ slug, title }: CategoryPillProps) {
  const selectedSlug = useParams().slug?.[0]
  const isSelected = slug === selectedSlug
  const href = slug ? `/categories/${slug}` : '/categories'

  return (
    <Link
      className="hover:bg-card rounded-full border px-6 py-2 text-left font-semibold transition-all aria-selected:bg-gray-100 aria-selected:text-gray-900"
      aria-selected={isSelected}
      href={href}
    >
      {title}
    </Link>
  )
}
