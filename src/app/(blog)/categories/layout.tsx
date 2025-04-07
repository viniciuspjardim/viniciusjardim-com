import 'server-only'

import { WidthContainer } from '~/components/width-container'
import { api } from '~/trpc/server'
import { CategoryPill } from '~/components/category/category-pill'

export default async function CategoriesLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // TODO: fetch only the categories. This request is fetching also the posts
  const { categories } = await api.pages.getAllPostsByCategorySlug({})

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

      <div className="my-16 w-full divide-y divide-dashed divide-neutral-800">
        {children}
      </div>
    </WidthContainer>
  )
}
