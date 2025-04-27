'use client'

import { useRouter } from 'next/navigation'
import { RefreshCcwIcon, PlusIcon } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '~/trpc/react'
import { Button } from '~/components/ui/button'
import Link from 'next/link'

export function AdminNav() {
  const router = useRouter()
  const ctx = api.useUtils()

  const { mutate: revalidatePosts, isPending: isRevalidatePostsLoading } =
    api.posts.revalidateCacheTag.useMutation({
      onSuccess: async () => {
        await ctx.posts.invalidate()
        router.refresh()
        toast('Posts revalidated.')
      },
      onError: () => {
        toast.error('Sorry, an error occurred while revalidating the posts.')
      },
    })

  const {
    mutate: revalidateCategories,
    isPending: isRevalidateCategoriesLoading,
  } = api.categories.revalidateCacheTag.useMutation({
    onSuccess: async () => {
      await ctx.categories.invalidate()
      router.refresh()
      toast('Categories revalidated.')
    },
    onError: () => {
      toast.error('Sorry, an error occurred while revalidating the categories.')
    },
  })

  return (
    <nav className="w-full space-y-2">
      <h1 className="text-3xl font-semibold">Admin</h1>

      <div className="flex justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            title="Revalidate posts"
            disabled={isRevalidatePostsLoading}
            onClick={() => revalidatePosts()}
          >
            <RefreshCcwIcon className="size-4" />
            <span>Posts</span>
          </Button>
          <Button
            variant="outline"
            title="Revalidate categories"
            disabled={isRevalidateCategoriesLoading}
            onClick={() => revalidateCategories()}
          >
            <RefreshCcwIcon className="size-4" />
            <span>Categories</span>
          </Button>
        </div>

        <Button className="font-semibold" asChild>
          <Link href="/admin/editor">
            <PlusIcon className="size-4" />
            <span>New post</span>
          </Link>
        </Button>
      </div>
    </nav>
  )
}
