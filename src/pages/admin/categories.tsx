import { useUser } from '@clerk/nextjs'

import { PageHead } from '~/components/PageHead'
import { Header } from '~/components/Header'
import { Category } from '~/components/category/Category'
import { api } from '~/utils/api'

const pageName = 'Categories (admin)'

export default function CategoriesAdmin() {
  const { data, isLoading } = api.categories.getAll.useQuery()
  const { user } = useUser()

  if (!user) {
    return (
      <>
        <PageHead page={pageName} />

        <Header />

        <div className="flex flex-col items-center space-y-8 py-4">
          <h1 className="text-3xl">{pageName}</h1>

          <div className="flex w-full max-w-3xl justify-center px-2">
            <p className="rounded-r-md border-l-4 border-orange-300 bg-slate-900/75 p-4 text-base">
              <strong>Info:</strong> please sign in to access {pageName}.
            </p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <PageHead page={pageName} />

      <Header />

      <div className="flex flex-col items-center space-y-8 py-4">
        <h1 className="text-3xl">{pageName}</h1>

        <main className="w-full max-w-3xl flex-col items-center px-2">
          {isLoading && (
            <p className="text-center">Loading the categories...</p>
          )}

          {data?.map((category) => (
            <Category
              key={category.id}
              id={category.id}
              name={category.name}
              slug={category.slug}
              subcategories={category.subcategories}
            />
          ))}
        </main>
      </div>
    </>
  )
}
