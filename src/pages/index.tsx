import Head from 'next/head'

import { AuthButton } from '~/components/AuthButton'
import { Post } from '~/components/Post'

export default function Home() {
  return (
    <>
      <Head>
        <title>Vinícius Jardim</title>
        <meta name="description" content="Vinícius Jardim's personal site" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#040308] to-[#121226]">
        <div className="container flex flex-col items-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            A <span className="text-rose-500">draft</span> blog!
          </h1>

          <AuthButton />

          <div>
            <Post
              title="Post 1"
              body="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Consequuntur fugit porro libero velit similique assumenda esse, dicta voluptates in nam dolorum tempora, non accusamus ad voluptatibus, obcaecati minima consectetur dolore?"
              writtenAt={new Date(2018, 11, 25)}
            />

            <Post
              title="Post 2"
              body="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Consequuntur fugit porro libero velit similique assumenda esse, dicta voluptates in nam dolorum tempora, non accusamus ad voluptatibus, obcaecati minima consectetur dolore?"
              writtenAt={new Date(2019, 5, 10)}
            />

            <Post
              title="Post 3"
              body="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Consequuntur fugit porro libero velit similique assumenda esse, dicta voluptates in nam dolorum tempora, non accusamus ad voluptatibus, obcaecati minima consectetur dolore?"
              writtenAt={new Date(2020, 8, 14)}
            />
          </div>
        </div>
      </main>
    </>
  )
}
