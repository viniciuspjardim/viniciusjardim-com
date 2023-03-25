import Head from 'next/head'

import { AuthButton } from '~/components/AuthButton'
import { Post } from '~/components/Post'
import { api } from '~/utils/api'

export default function Home() {
  const { data, isLoading } = api.posts.getAll.useQuery()

  return (
    <>
      <Head>
        <title>Vinícius Jardim</title>
        <meta name="description" content="Vinícius Jardim's personal site" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#040308] to-[#121226] text-white">
        <div className="container flex max-w-3xl flex-col items-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            A <span className="text-rose-500">draft</span> blog!
          </h1>

          <AuthButton />

          {isLoading && <p>Loading the posts...</p>}

          {data?.map((post) => (
            <Post
              key={post.id}
              title={post.title}
              content={post.content}
              writtenAt={post.writtenAt ?? post.createdAt}
            />
          ))}
        </div>
      </main>
    </>
  )
}
