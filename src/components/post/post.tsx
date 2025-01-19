import type { JSONContent } from '@tiptap/core'

import { JsonParser } from './json-parser'
import { PublishDetails } from './publish-details'

type PostProps = {
  title: string
  description: string | null
  content: string
  writtenAt: Date
  userName: string
  userImageUrl?: string | null
}

export function Post({
  title,
  description,
  content,
  writtenAt,
  userName,
  userImageUrl,
}: PostProps) {
  const jsonContent = JSON.parse(content) as JSONContent

  return (
    <article className="w-full space-y-6">
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
        writtenAt={writtenAt}
        userName={userName}
        userImageUrl={userImageUrl}
      />

      <JsonParser {...jsonContent} />
    </article>
  )
}
