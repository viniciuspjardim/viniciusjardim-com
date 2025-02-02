import { api } from '~/utils/api'
import { asSlug } from '~/helpers/as-slug'
import { Button } from '~/components/ui/button'
import { PostForm, type PostFormInputs } from './post-form'

type EditPostFormProps = {
  id: number
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
      slug: asSlug(form.title),
      title: form.title,
      description: form.description || undefined,
      keywords: form.keywords || undefined,
      content: editorJson,
      rank: form.rank ? parseInt(form.rank, 10) : undefined,
      lang: form.lang ? form.lang : undefined,
      writtenAt: form.writtenAt ? new Date(form.writtenAt) : undefined,
      categoryId: parseInt(form.categoryId, 10),
    })
  }

  const defaultValues = {
    title: props.title,
    description: props.description,
    keywords: props.keywords,
    content: props.content,
    rank: props.rank.toString(),
    categoryId: props.categoryId.toString(),
    lang: props.lang,
    writtenAt: props.writtenAt.toISOString(),
  }

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
    />
  )
}
