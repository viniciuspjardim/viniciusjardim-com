import type { s } from '~/db'

import { useState } from 'react'
import Link from 'next/link'
import { Edit3Icon, TrashIcon } from 'lucide-react'
import posthog from 'posthog-js'

import { api } from '~/trpc/react'
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
  post: s.Post
  userName: string
  userImageUrl?: string
}

export function PostWithActions({
  post,
  userName,
  userImageUrl,
}: PostWithActionsProps) {
  const ctx = api.useUtils()

  const [isEditing, setIsEditing] = useState(false)
  const { toast } = useToast()

  const { mutateAsync: remove, isPending: isRemovingPost } =
    api.posts.remove.useMutation({
      onSuccess: async () => {
        await ctx.posts.getAll.invalidate()
      },
    })

  const { mutate: generateSpeech, isPending: isGenerateSpeechLoading } =
    api.posts.generateSpeech.useMutation()

  if (isEditing)
    return (
      <div className="mb-6 px-4 py-16">
        <EditPostForm
          post={post}
          userName={userName}
          userImageUrl={userImageUrl}
          closeForm={() => setIsEditing(false)}
        />
      </div>
    )

  const { id, slug } = post

  return (
    <div className="flex w-full justify-between gap-3 px-4 py-2 transition-colors hover:bg-neutral-950">
      {post.published ? (
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

      <Link className="w-full" href={`/posts/${post.slug}`}>
        <span className="text-lg font-bold text-neutral-300">{post.title}</span>
        {post.description && (
          <p className="text-sm text-neutral-400">{post.description}</p>
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
                <strong className="font-semibold">
                  &quot;{post.title}&quot;
                </strong>{' '}
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
          variant="outline"
          disabled={isGenerateSpeechLoading}
          onClick={() => generateSpeech({ slug })}
        >
          {isGenerateSpeechLoading ? '...' : '🔊'}
        </Button>

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
