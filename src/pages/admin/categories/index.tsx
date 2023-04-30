import Head from 'next/head'
import { useUser } from '@clerk/nextjs'

import { api } from '~/utils/api'
import { Header } from '~/components/Header'
import { Category } from '~/components/category/Category'

export default function ManageCategoriesPage() {
  const { data, isLoading } = api.categories.getAll.useQuery()
  const { user } = useUser()

  if (!user) {
    return (
      <div className="flex flex-col items-center space-y-8 py-4">
        <Header />

        <h1 className="text-3xl">Manage Categories</h1>

        <div className="flex w-full max-w-3xl justify-center px-2">
          <p className="rounded-r-md border-l-4 border-rose-500 bg-slate-900/75 p-4 text-base">
            <strong>Info:</strong> Please sign in to manage the categories.
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Vinícius Jardim | Manage Categories</title>
        <meta name="description" content="Vinícius Jardim's personal site" />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <div className="flex flex-col items-center space-y-8 py-4">
        <Header />

        <h1 className="text-3xl">Manage Categories</h1>

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
