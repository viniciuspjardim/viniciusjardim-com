'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { RefreshCcwIcon, PlusIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import Link from 'next/link'
import { updateCacheTag } from '~/server/api/actions/cache-actions'

export function AdminNav() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleRevalidate = async (tag: 'posts-list' | 'categories-list') => {
    try {
      startTransition(async () => {
        await updateCacheTag(tag)
        router.refresh()
        toast('Cache updated')
      })
    } catch {
      toast.error('Sorry, an error occurred while updating the cache.')
    }
  }

  return (
    <nav className="w-full space-y-2">
      <h1 className="text-3xl font-semibold">Admin</h1>

      <div className="flex justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            title="Revalidate posts"
            disabled={isPending}
            onClick={() => handleRevalidate('posts-list')}
          >
            <RefreshCcwIcon className="size-4" />
            <span>Posts</span>
          </Button>
          <Button
            variant="outline"
            title="Revalidate categories"
            disabled={isPending}
            onClick={() => handleRevalidate('categories-list')}
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
