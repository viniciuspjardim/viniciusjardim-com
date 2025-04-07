'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export type CategoryPillProps = {
  selectedSlug?: string
  slug?: string
  title: string
}

export function CategoryPill({ slug, title }: CategoryPillProps) {
  let selectedSlug
  const paths = usePathname().split('/')

  // Get the selected slug from the URL path
  if (2 in paths) {
    selectedSlug = paths[2]
  }

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
