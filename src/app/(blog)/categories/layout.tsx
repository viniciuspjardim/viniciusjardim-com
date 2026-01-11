import 'server-only'

import { cacheLife, cacheTag } from 'next/cache'
import { db } from '~/db'
import { WidthContainer } from '~/components/width-container'
import { CategoryPill } from '~/components/category/category-pill'

export default async function CategoriesLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  'use cache'
  cacheLife('max')
  cacheTag('categories-list')

  const categories = await db.category.getAll()

  return (
    <WidthContainer className="flex w-full flex-col items-center">
      <div className="flex w-full gap-2 overflow-x-auto px-4 pt-16 [scrollbar-width:none] md:px-10">
        <CategoryPill title="All" />
        {categories.map((category) => (
          <CategoryPill
            key={category.id}
            slug={category.slug}
            title={category.title}
          />
        ))}
      </div>
      {children}
    </WidthContainer>
  )
}
