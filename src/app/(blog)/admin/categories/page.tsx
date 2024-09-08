'use client'

import { useUser } from '@clerk/nextjs'

import { Category } from '~/components/category/category'
import { WidthContainer } from '~/components/width-container'
import { api } from '~/utils/api'

const pageName = 'Categories'

export default function CategoriesAdmin() {
  const { data, isLoading } = api.categories.getAll.useQuery()
  const { user } = useUser()

  if (!user) {
    return (
      <WidthContainer className="space-y-8 py-12">
        <h1 className="text-3xl">{pageName}</h1>

        <p className="rounded-r-md border-l-4 border-rose-600 bg-neutral-900 p-4 text-base">
          <strong>Info:</strong> please sign in to access {pageName}.
        </p>
      </WidthContainer>
    )
  }

  return (
    <WidthContainer className="space-y-8 py-12">
      <h1 className="text-3xl">{pageName}</h1>

      {isLoading && <p>Loading...</p>}

      {data?.map((category) => (
        <Category
          key={category.id}
          id={category.id}
          slug={category.slug}
          title={category.title}
          subcategories={category.subcategories}
        />
      ))}
    </WidthContainer>
  )
}
