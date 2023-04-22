import type { JSONContent } from '@tiptap/core'

import Image from 'next/image'
import { JsonParser } from './JsonParser'

type PostProps = {
  title: string
  content: string
  writtenAt: Date
  userName: string
  userImageUrl?: string
}

export function Post({
  title,
  content,
  writtenAt,
  userName,
  userImageUrl,
}: PostProps) {
  const jsonContent = JSON.parse(content) as JSONContent

  return (
    <article className="w-full rounded-md bg-slate-900/75 p-2 md:p-8">
      <h2 className="text-xl text-rose-500 md:text-2xl">{title}</h2>

      <JsonParser {...jsonContent} />

      <div className="flex justify-end gap-x-2">
        <div className="text-right">
          <p className="text-md text-rose-500">{userName}</p>

          <p className="text-sm text-slate-500">
            {writtenAt.toLocaleDateString()}
          </p>
        </div>

        {userImageUrl && (
          <Image
            className="h-12 w-12 rounded-full"
            src={userImageUrl}
            alt={userName}
            width={48}
            height={48}
            quality={100}
          />
        )}
      </div>
    </article>
  )
}
