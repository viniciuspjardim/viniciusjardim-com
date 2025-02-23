import { useState } from 'react'
import Link from 'next/link'
import { Edit3Icon, TrashIcon } from 'lucide-react'
import posthog from 'posthog-js'

import { api } from '~/utils/api'
import { EditPostForm } from './edit-post-form'
import { Button } from '~/components/ui/button'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '~/components/ui/alert-dialog'
import { useToast } from '~/hooks/use-toast'

type PostWithActionsProps = {
  id: number
  slug: string
  title: string
  description: string | null
  keywords: string | null
  content: string
  userName: string
  userImageUrl?: string
  rank: number
  categoryId: number
  lang: string
  writtenAt: Date
  published: boolean
}

export function PostWithActions({
  id,
  slug,
  title,
  description,
  keywords,
  content,
  userName,
  userImageUrl,
  rank,
  categoryId,
  lang,
  writtenAt,
  published,
}: PostWithActionsProps) {
  const ctx = api.useUtils()

  const [isEditing, setIsEditing] = useState(false)
  const { toast } = useToast()

  const { mutateAsync: remove, isLoading: isRemovingPost } =
    api.posts.remove.useMutation({
      onSuccess: async () => {
        await ctx.posts.getAll.invalidate()
      },
    })

  if (isEditing)
    return (
      <div className="mb-6 px-4 py-16">
        <EditPostForm
          id={id}
          title={title}
          description={description}
          keywords={keywords}
          content={content}
          userName={userName}
          userImageUrl={userImageUrl}
          rank={rank}
          categoryId={categoryId}
          lang={lang}
          writtenAt={writtenAt}
          published={published}
          closeForm={() => setIsEditing(false)}
        />
      </div>
    )

  return (
    <div className="flex w-full justify-between gap-3 px-4 py-2 transition-colors hover:bg-neutral-950">
      {published ? (
        <span
          className="mr-1 mt-2 size-2.5 shrink-0 rounded-full bg-green-400"
          title="Published"
        />
      ) : (
        <span
          className="mr-1 mt-2 size-2.5 shrink-0 rounded-full bg-orange-400"
          title="Not published"
        />
      )}

      <Link className="w-full" href={`/posts/${slug}`}>
        <span className="text-lg font-bold text-neutral-300">{title}</span>
        {description && (
          <p className="text-sm text-neutral-400">{description}</p>
        )}
      </Link>

      <div className="flex justify-center gap-3">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              className="px-2"
              variant="destructive"
              disabled={isRemovingPost}
              onClick={() => {
                posthog.capture('delete-post-dialog-open', { slug: 'slug' })
              }}
            >
              <TrashIcon className="size-5" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete your{' '}
                <strong className="font-semibold">&quot;{title}&quot;</strong>{' '}
                post. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={isRemovingPost}
                onClick={async () => {
                  try {
                    await remove({ id })
                    posthog.capture('delete-post-success', { slug })
                    toast({
                      description: `Your post has been deleted.`,
                    })
                  } catch (error) {
                    posthog.capture('delete-post-error', { slug, error })
                    toast({
                      variant: 'destructive',
                      description:
                        'An error occurred while deleting your post.',
                    })
                  }
                }}
              >
                <TrashIcon className="mr-2 size-5" />
                <span>Delete</span>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Button
          className="px-2"
          disabled={isRemovingPost}
          onClick={() => setIsEditing(true)}
        >
          <Edit3Icon className="size-5" />
        </Button>
      </div>
    </div>
  )
}
