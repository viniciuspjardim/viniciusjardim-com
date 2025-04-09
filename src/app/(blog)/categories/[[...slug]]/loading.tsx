import { PostCardSkeleton } from '~/components/post/post-card'

// TODO: add a loading skeleton for the category page
export default function LoadingCategoryPage() {
  return (
    <>
      <PostCardSkeleton />
      <PostCardSkeleton />
    </>
  )
}
