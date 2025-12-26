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
  cacheTag('category-page')

  const categories = await db.category.getAll()

  return (
    <WidthContainer className="flex w-full flex-col items-center">
      <div className="flex w-full gap-2 overflow-x-auto pt-16 [scrollbar-width:none]">
        <CategoryPill title="All" />
        {categories.map((category) => (
          <CategoryPill
            key={category.id}
            slug={category.slug}
            title={category.title}
          />
        ))}
      </div>
      <div className="my-6 w-full divide-y divide-dashed">{children}</div>
    </WidthContainer>
  )
}
