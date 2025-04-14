import 'server-only'

import { WidthContainer } from '~/components/width-container'
import { api } from '~/trpc/server'
import { CategoryPill } from '~/components/category/category-pill'

export default async function CategoriesLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const categories = await api.categories.getAll()

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
