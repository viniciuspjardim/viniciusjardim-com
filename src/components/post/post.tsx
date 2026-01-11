import type { s } from '~/db'

import Link from 'next/link'

import { cn } from '~/lib/utils'
import { findPostNode, getPostHeadings } from '~/helpers/tiptap-utils'
import { JsonParser } from './json-parser'
import { PublishDetails } from './publish-details'
import { GoToTopButton } from './go-to-top-button'

type PostProps = {
  className?: string
  post: s.Post
  userName: string
  userImageUrl?: string | null
}

export function Post({ className, post, userName, userImageUrl }: PostProps) {
  const audioUrl = findPostNode(post.content, 'speech')?.attrs?.src as
    | string
    | undefined

  const headings = getPostHeadings(post.content)
  const showPostNav = headings.length >= 3

  return (
    <div className={cn('flex w-full gap-8', className)}>
      {/* Post navigation */}
      {showPostNav && (
        <nav className="order-last -mt-18 hidden w-64 shrink-0 lg:block">
          {/* Headings */}
          <div className="sticky top-0 max-h-svh overflow-y-auto pt-18 pb-6">
            <div>
              <span className="block text-2xl text-neutral-300">
                In this article
              </span>
              <ol className="space-y-3 pt-4 text-lg leading-6">
                {headings.map((heading) => (
                  <li
                    className={cn({
                      'ml-3': heading.level >= 4,
                    })}
                    key={heading.slug}
                  >
                    <Link
                      className="font-light text-neutral-300 transition-colors hover:text-white"
                      href={`#${heading.slug}`}
                    >
                      {heading.text}
                    </Link>
                  </li>
                ))}
              </ol>
            </div>

            {/* Separator */}
            <div className="mt-4 mb-3 border-b" />

            {/* Go to top button */}
            <div>
              <GoToTopButton />
            </div>
          </div>
        </nav>
      )}

      <article className="min-w-0 grow space-y-6" lang={post.lang}>
        <div className="space-y-2 px-4 md:px-10">
          <h1 className="text-4xl font-medium text-balance text-neutral-200 md:text-5xl md:font-light">
            {post.title}
          </h1>

          {post.description && (
            <h2 className="text-xl text-neutral-400">{post.description}</h2>
          )}
        </div>

        <div className="md:px-10">
          <PublishDetails
            variant="outline"
            lang={post.lang}
            writtenAt={post.writtenAt}
            userName={userName}
            userImageUrl={userImageUrl}
            audioUrl={audioUrl}
          />
        </div>

        <JsonParser {...post.content} />
      </article>
    </div>
  )
}
