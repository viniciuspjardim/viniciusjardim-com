import { api } from '~/utils/api'
import { asSlug } from '~/helpers/as-slug'
import { Button } from '~/components/ui/button'
import { PostForm, type PostFormInputs } from './post-form'

type EditPostFormProps = {
  id: number
  title: string
  content: string
  userName: string
  userImageUrl?: string
  rank: number
  categoryId: number
  writtenAt: Date
  closeForm: () => void
}

export function EditPostForm(props: EditPostFormProps) {
  const { id, closeForm } = props
  const ctx = api.useUtils()

  const { mutateAsync, isLoading: isPosting } = api.posts.update.useMutation({
    onSuccess: async () => {
      await ctx.posts.getAll.invalidate()
      closeForm()
    },
  })

  async function handleSubmit(form: PostFormInputs, editorJson: string) {
    return mutateAsync({
      id,
      title: form.title,
      slug: asSlug(form.title),
      content: editorJson,
      rank: form.rank ? parseInt(form.rank, 10) : undefined,
      writtenAt: form.writtenAt ? new Date(form.writtenAt) : undefined,
      categoryId: parseInt(form.categoryId, 10),
    })
  }

  const defaultValues = {
    title: props.title,
    content: props.content,
    rank: props.rank.toString(),
    categoryId: props.categoryId.toString(),
    writtenAt: props.writtenAt.toISOString().substring(0, 10),
  }

  const { data: categoriesData, isLoading: categoriesLoading } =
    api.categories.getAllFlat.useQuery()

  const extraActions = (
    <Button variant="outline" type="button" onClick={closeForm}>
      Cancel
    </Button>
  )

  return (
    <PostForm
      defaultValues={defaultValues}
      userName={props.userName}
      userImageUrl={props.userImageUrl}
      onSubmit={handleSubmit}
      submitButtonLabel="Save Post"
      isPosting={isPosting}
      extraActions={extraActions}
      categoriesData={categoriesData}
      categoriesLoading={categoriesLoading}
    />
  )
}
