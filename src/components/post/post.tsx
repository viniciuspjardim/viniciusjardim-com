import type { s } from '~/db'

import Link from 'next/link'

import { cn } from '~/helpers/cn'
import { findPostNode, getPostHeadings } from '~/helpers/tiptap-utils'
import { JsonParser } from './json-parser'
import { PublishDetails } from './publish-details'
import { GoToTopButton } from './go-to-top-button'

type PostProps = {
  post: s.Post
  userName: string
  userImageUrl?: string | null
}

export function Post({ post, userName, userImageUrl }: PostProps) {
  const audioUrl = findPostNode(post.content, 'speech')?.attrs?.src as
    | string
    | undefined

  const headings = getPostHeadings(post.content)
  const showPostNav = headings.length >= 3

  return (
    <div className="flex w-full gap-8">
      {/* Post navigation */}
      {showPostNav && (
        <nav className="order-last -mt-6 hidden w-64 shrink-0 lg:block">
          {/* Headings */}
          <div className="sticky top-0 max-h-svh overflow-y-auto py-6">
            <div>
              <span className="block text-2xl font-semibold text-neutral-300">
                In this article
              </span>
              <ol className="space-y-3 pt-4 text-lg leading-6">
                {headings.map((heading) => (
                  <li
                    className={cn({
                      'ml-4 text-base leading-5': heading.level >= 4,
                    })}
                    key={heading.slug}
                  >
                    <Link
                      className="font-medium text-neutral-400 transition-colors hover:text-white"
                      href={`#${heading.slug}`}
                    >
                      {heading.text}
                    </Link>
                  </li>
                ))}
              </ol>
            </div>

            {/* Separator */}
            <div className="mb-3 mt-4 border-b border-neutral-800" />

            {/* Go to top button */}
            <div>
              <GoToTopButton />
            </div>
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

        <JsonParser {...post.content} />
      </article>
    </div>
  )
}
