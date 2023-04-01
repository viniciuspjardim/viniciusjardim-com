import Head from 'next/head'
import Link from 'next/link'

import { AuthButton } from '~/components/AuthButton'
import { AddPost } from '~/components/AddPost'
import { Post } from '~/components/Post'
import { api } from '~/utils/api'

export default function CreatePostPage() {
  const { data, isLoading } = api.posts.getAll.useQuery()

  return (
    <>
      <Head>
        <title>Vinícius Jardim | Create a Post</title>
        <meta name="description" content="Vinícius Jardim's personal site" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col items-center space-y-8 py-4">
        <Link href={'/'}>Home</Link>

        <AuthButton />

        <AddPost />

        <main className="w-full max-w-3xl flex-col items-center gap-12 px-2">
          {isLoading && <p className="text-center">Loading the posts...</p>}

          {data?.map((post) => (
            <Post
              key={post.id}
              title={post.title}
              content={post.content}
              writtenAt={post.writtenAt}
              userName={post.author?.userName ?? 'Unknown'}
              userImageUrl={post.author?.userImageUrl}
            />
          ))}
        </main>
      </div>
    </>
  )
}
