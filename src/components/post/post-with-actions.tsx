import type { JSONContent } from '@tiptap/core'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Edit3Icon, TrashIcon } from 'lucide-react'

import { api } from '~/utils/api'
import { JsonParser } from './json-parser'
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
  writtenAt: Date
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
  writtenAt,
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
        writtenAt={writtenAt}
        closeForm={() => setIsEditing(false)}
      />
    )

  const jsonContent = JSON.parse(content) as JSONContent

  return (
    <article className="w-full space-y-4">
      <div className="flex justify-between gap-3">
        <Link
          className="decoration-rose-800 hover:underline"
          href={`/posts/${slug}`}
        >
          <h2 className="text-2xl font-bold text-neutral-300 md:text-4xl">
            {title}
          </h2>
        </Link>

        <div className="flex justify-center gap-3">
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
                      toast({
                        description: `Your post has been deleted.`,
                      })
                    } catch (error) {
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

          <Button disabled={isRemovingPost} onClick={() => setIsEditing(true)}>
            <Edit3Icon className="mr-2 size-5" /> <span>Edit</span>
          </Button>
        </div>
      </div>

      <div className="flex gap-3">
        {userImageUrl && (
          <Image
            className="mt-1 h-10 w-10 rounded-full"
            src={userImageUrl}
            alt={userName}
            width={40}
            height={40}
            quality={100}
          />
        )}

        <div>
          <p className="text-md font-semibold text-rose-800">{userName}</p>
          <p className="text-sm">{writtenAt.toLocaleDateString()}</p>
        </div>
      </div>

      <JsonParser {...jsonContent} />
    </article>
  )
}
