import type { JSONContent } from '@tiptap/core'

import { findPostNode } from '~/helpers/tiptap-utils'
import { JsonParser } from './json-parser'
import { PublishDetails } from './publish-details'

type PostProps = {
  title: string
  description: string | null
  content: string
  lang: string
  writtenAt: Date
  userName: string
  userImageUrl?: string | null
}

export function Post({
  title,
  description,
  content,
  lang,
  writtenAt,
  userName,
  userImageUrl,
}: PostProps) {
  const jsonContent = JSON.parse(content) as JSONContent
  const audioUrl = findPostNode(jsonContent, 'speech')?.attrs?.src as
    | string
    | undefined

  return (
    <article className="w-full space-y-6" lang={lang}>
      <div className="space-y-2">
        <h1 className="text-balance text-4xl font-bold text-neutral-300 md:text-5xl">
          {title}
        </h1>

        {description && (
          <h2 className="text-xl text-neutral-400 md:text-2xl">
            {description}
          </h2>
        )}
      </div>

      <PublishDetails
        variant="outline"
        lang={lang}
        writtenAt={writtenAt}
        userName={userName}
        userImageUrl={userImageUrl}
        audioUrl={audioUrl}
      />

      <JsonParser {...jsonContent} />
    </article>
  )
}
