'use client'

import type { s } from '~/db'

import Link from 'next/link'
import { Edit3Icon, TrashIcon } from 'lucide-react'
import { toast } from 'sonner'

import { api } from '~/trpc/react'
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

type PostWithActionsProps = {
  post: s.Post
}

function PostWithActions({ post }: PostWithActionsProps) {
  const ctx = api.useUtils()
  const { mutateAsync: remove, isPending: isRemovingPost } =
    api.posts.remove.useMutation({
      onSuccess: async () => {
        await ctx.posts.getAll.invalidate()
      },
    })

  const { mutate: generateSpeech, isPending: isGenerateSpeechLoading } =
    api.posts.generateSpeech.useMutation()

  return (
    <div className="hover:bg-card/50 flex w-full justify-between gap-3 px-4 py-2 transition-colors">
      {post.published ? (
        <span
          className="mt-2 mr-1 size-2.5 shrink-0 rounded-full bg-green-400"
          title="Published"
        />
      ) : (
        <span
          className="mt-2 mr-1 size-2.5 shrink-0 rounded-full bg-orange-400"
          title="Not published"
        />
      )}

      <Link className="w-full" href={`/posts/${post.slug}`}>
        <span className="text-lg font-bold text-neutral-300">{post.title}</span>
        {post.description && (
          <p className="text-sm text-neutral-400">{post.description}</p>
        )}
      </Link>

      <div className="flex justify-center gap-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              className="px-2"
              variant="destructive"
              disabled={isRemovingPost}
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
                    await remove({ id: post.id })
                    toast('Your post has been deleted.')
                  } catch (_error) {
                    toast('An error occurred while deleting your post.')
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
          onClick={() => generateSpeech({ slug: post.slug })}
        >
          {isGenerateSpeechLoading ? '...' : '🔊'}
        </Button>

        <Button className="px-2" disabled={isRemovingPost} asChild>
          <Link
            href={{ pathname: '/admin/editor', query: { postId: post.id } }}
          >
            <Edit3Icon className="size-5" />
          </Link>
        </Button>
      </div>
    </div>
  )
}

export function EditPostList() {
  const [posts, { isLoading: isPostsLoading, isError: isPostsError }] =
    api.posts.getAll.useSuspenseQuery({ showUnpublished: true })

  if (isPostsLoading) {
    return 'Loading...'
  }
  if (isPostsError) {
    return 'Error!'
  }
  if (!posts?.length) {
    return 'No posts found!'
  }

  return (
    <div className="divide-y overflow-hidden rounded-lg border">
      {posts.map((post) => (
        <PostWithActions key={post.id} post={post} />
      ))}
    </div>
  )
}
