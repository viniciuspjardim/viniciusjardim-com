import Image from 'next/image'

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
  return (
    <article className="mb-8 w-full rounded-md bg-slate-900/75 p-8">
      <h2 className="text-2xl text-rose-500 md:text-4xl">{title}</h2>

      <pre className="my-8 whitespace-pre-wrap text-lg md:text-xl">
        {content}
      </pre>

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
