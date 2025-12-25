import 'server-only'

import { Suspense } from 'react'
import { cacheLife, cacheTag } from 'next/cache'
import { db } from '~/db'
import { WidthContainer } from '~/components/width-container'
import { CategoryPill } from '~/components/category/category-pill'

export async function CategoriesList() {
  'use cache'
  cacheLife('max')
  cacheTag('category-page')

  const categories = await db.category.getAll()

  return (
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
  )
}

export default async function CategoriesLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <WidthContainer className="flex w-full flex-col items-center">
      <Suspense fallback={<div className="pt-[106px]" />}>
        <CategoriesList />
      </Suspense>
      <div className="my-6 w-full divide-y divide-dashed">
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
      </div>
    </WidthContainer>
  )
}
