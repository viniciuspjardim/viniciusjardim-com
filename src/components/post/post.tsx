import type { JSONContent } from '@tiptap/core'
import type { s } from '~/db'

import Link from 'next/link'

import { findPostNode, getPostHeadings } from '~/helpers/tiptap-utils'
import { JsonParser } from './json-parser'
import { PublishDetails } from './publish-details'
import { cn } from '~/helpers/cn'

type PostProps = {
  post: s.Post
  userName: string
  userImageUrl?: string | null
}

export function Post({ post, userName, userImageUrl }: PostProps) {
  const jsonContent = JSON.parse(post.content) as JSONContent
  const audioUrl = findPostNode(jsonContent, 'speech')?.attrs?.src as
    | string
    | undefined

  const headings = getPostHeadings(jsonContent)
  const showPostNav = headings.length >= 3

  return (
    <div className="flex w-full gap-8">
      {showPostNav && (
        <nav className="order-last hidden w-64 shrink-0 lg:block">
          <div className="sticky top-6 max-h-svh overflow-y-auto">
            <span className="block pb-4 text-2xl font-semibold text-neutral-300">
              In this article
            </span>
            <ol className="space-y-3 text-lg leading-6">
              {headings.map((heading) => (
                <li
                  className={cn({
                    'ml-4 text-base leading-5': heading.level >= 4,
                  })}
                  key={heading.slug}
                >
                  <Link
                    className="text-neutral-400 transition-colors hover:text-white"
                    href={`#${heading.slug}`}
                  >
                    {heading.text}
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </nav>
      )}

      <article className="min-w-0 flex-grow space-y-6" lang={post.lang}>
        <div className="space-y-2">
          <h1 className="text-balance text-4xl font-bold text-neutral-300 md:text-5xl">
            {post.title}
          </h1>

          {post.description && (
            <h2 className="text-xl text-neutral-400 md:text-2xl">
              {post.description}
            </h2>
          )}
        </div>

        <PublishDetails
          variant="outline"
          lang={post.lang}
          writtenAt={post.writtenAt}
          userName={userName}
          userImageUrl={userImageUrl}
          audioUrl={audioUrl}
        />

        <JsonParser {...jsonContent} />
      </article>
    </div>
  )
}
