import { useUser } from '@clerk/nextjs'

import { api } from '~/utils/api'
import { asSlug } from '~/helpers/as-slug'
import { PostForm, type PostFormInputs } from './post-form'

export function CreatePostForm() {
  const { user } = useUser()
  const ctx = api.useUtils()

  const { mutateAsync, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: async () => {
      await ctx.posts.getAll.invalidate()
    },
  })

  async function handleSubmit(form: PostFormInputs, editorJson: string) {
    return mutateAsync({
      title: form.title,
      slug: asSlug(form.title),
      content: editorJson,
      rank: form.rank ? parseInt(form.rank, 10) : undefined,
      writtenAt: form.writtenAt ? new Date(form.writtenAt) : undefined,
      categoryId: parseInt(form.categoryId, 10),
    })
  }

  if (!user) return null

  const defaultValues = {
    title: '',
    rank: '',
    categoryId: '',
    writtenAt: '',
    content: '',
  }

  const { data: categoriesData, isLoading: categoriesLoading } =
    api.categories.getAllFlat.useQuery()

  return (
    <PostForm
      defaultValues={defaultValues}
      userName={user.username || 'Anonymous'}
      userImageUrl={user.imageUrl}
      onSubmit={handleSubmit}
      submitButtonLabel="Publish Post"
      isPosting={isPosting}
      categoriesData={categoriesData}
      categoriesLoading={categoriesLoading}
    />
  )
}
