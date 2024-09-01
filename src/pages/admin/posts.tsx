import { useUser } from '@clerk/nextjs'

import { PageHead } from '~/components/page-head'
import { Navbar } from '~/components/navbar'
import { CreatePostForm } from '~/components/post/create-post-form'
import { PostWithActions } from '~/components/post/post-with-actions'
import { api } from '~/utils/api'

const pageName = 'Posts (admin)'

export default function PostsAdmin() {
  const { data, isLoading } = api.posts.getAll.useQuery()
  const { user } = useUser()

  if (!user) {
    return (
      <>
        <PageHead page={pageName} />

        <Navbar />

        <div className="flex flex-col items-center space-y-8 px-4 md:px-10">
          <h1 className="text-3xl">{pageName}</h1>

          <div className="flex w-full max-w-6xl justify-center px-2">
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

      <Navbar />

      <div className="flex flex-col items-center space-y-8 py-4">
        <h1 className="text-3xl">{pageName}</h1>

        <CreatePostForm />

        <main className="w-full max-w-6xl flex-col items-center space-y-6 px-4 md:px-10">
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
