import { formatDate } from '~/utils/dates'

type PostProps = {
  title: string
  content: string
  writtenAt: Date
}

export function Post({ title, content, writtenAt }: PostProps) {
  return (
    <article className="mb-8 w-full rounded-md bg-slate-900/75 p-8">
      <h2 className="text-2xl text-rose-500 md:text-4xl">{title}</h2>

      <p className="my-8 text-lg md:text-xl">{content}</p>

      <div className="text-right">
        <p className="text-sm text-slate-500">{formatDate(writtenAt)}</p>

        <p className="text-md text-rose-500">John Doe</p>
      </div>
    </article>
  )
}
