import type { JSONContent } from '@tiptap/core'
import type { s } from '~/db'

import { findPostNode } from '~/helpers/tiptap-utils'
import { JsonParser } from './json-parser'
import { PublishDetails } from './publish-details'

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

  return (
    <article className="w-full space-y-6" lang={post.lang}>
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
  )
}
