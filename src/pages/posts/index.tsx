import Head from 'next/head'
import { useUser } from '@clerk/nextjs'

import { Header } from '~/components/Header'
import { CreatePostForm } from '~/components/post/CreatePostForm'
import { PostWithActions } from '~/components/post/PostWithActions'
import { api } from '~/utils/api'

export default function ManagePostsPage() {
  const { data, isLoading } = api.posts.getAll.useQuery()
  const { user } = useUser()

  if (!user) {
    return (
      <div className="flex flex-col items-center space-y-8 py-4">
        <Header />

        <h1 className="text-3xl">Manage Posts</h1>

        <div className="flex w-full max-w-3xl justify-center px-2">
          <p className="rounded-r-md border-l-4 border-rose-500 bg-slate-900/75 p-4 text-base">
            <strong>Info:</strong> Please sign in to manage the posts.
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Vinícius Jardim | Manage Post</title>
        <meta name="description" content="Vinícius Jardim's personal site" />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <div className="flex flex-col items-center space-y-8 py-4">
        <Header />

        <h1 className="text-3xl">Manage Posts</h1>

        <CreatePostForm />

        <main className="w-full max-w-3xl flex-col items-center space-y-6 px-2">
          {isLoading && <p className="text-center">Loading the posts...</p>}

          {data?.map((post) => (
            <PostWithActions
              key={post.id}
              id={post.id}
              title={post.title}
              content={post.content}
              userName={post.author?.userName ?? 'Unknown'}
              userImageUrl={post.author?.userImageUrl}
              rank={post.rank}
              writtenAt={post.writtenAt}
            />
          ))}
        </main>
      </div>
    </>
  )
}
