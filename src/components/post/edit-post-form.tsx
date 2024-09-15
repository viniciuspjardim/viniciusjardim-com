import { useState, useCallback } from 'react'
import Image from 'next/image'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { ImageIcon } from 'lucide-react'

import { api } from '~/utils/api'
import { asSlug } from '~/helpers/as-slug'
import { Button } from '~/components/ui/button'
import { useEditor } from '~/hooks/use-editor'

type Inputs = {
  title: string
  rank: string
  categoryId: string
  writtenAt: string
  content: string
}

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

export function EditPostForm({
  id,
  title,
  content,
  userName,
  userImageUrl,
  rank,
  categoryId,
  writtenAt,
  closeForm,
}: EditPostFormProps) {
  const [moreOptions, setMoreOptions] = useState(false)
  const { data: categoriesData, isLoading: categoriesLoading } =
    api.categories.getAllFlat.useQuery()

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { isValid: isFormValid },
  } = useForm<Inputs>({
    defaultValues: {
      title,
      content,
      rank: rank.toString(),
      categoryId: categoryId.toString(),
      writtenAt: writtenAt.toISOString(),
    },
  })

  const { Editor, editor } = useEditor(content)

  const slug = asSlug(watch('title') ?? '')
  const isValid = isFormValid && !editor?.isEmpty

  const addImage = useCallback(() => {
    const url = window.prompt('URL')

    if (url) {
      editor?.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  const onSubmit: SubmitHandler<Inputs> = (form) => {
    mutate({
      id,
      title: form.title,
      slug,
      content: JSON.stringify(editor?.getJSON()) || '',
      rank: form.rank ? parseInt(form.rank, 10) : undefined,
      writtenAt: form.writtenAt ? new Date(form.writtenAt) : undefined,
      categoryId: parseInt(form.categoryId, 10),
    })
  }

  const ctx = api.useUtils()

  const { mutate, isLoading: isPosting } = api.posts.update.useMutation({
    onSuccess: async () => {
      await ctx.posts.getAll.invalidate()
      reset()
      editor?.commands.setContent('')
      closeForm()
    },
  })

  return (
    <form
      className="flex w-full flex-col space-y-3"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex space-x-3">
        {userImageUrl && (
          <Image
            className="h-12 w-12 rounded-full"
            src={userImageUrl}
            alt={userName}
            width={48}
            height={48}
            quality={100}
          />
        )}

        <div className="flex w-full flex-col space-y-1">
          <input
            type="text"
            placeholder="Title"
            disabled={isPosting}
            {...register('title', { required: true })}
          />

          <div className="flex justify-between">
            <p className="text-sm opacity-40">➡️ {slug || 'Post Slug'}</p>

            <button
              className="opacity-70 transition hover:opacity-100"
              type="button"
              onClick={() => setMoreOptions(!moreOptions)}
            >
              {moreOptions ? '-' : '+'} Options
            </button>
          </div>
        </div>
      </div>

      {moreOptions && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <input
            type="text"
            placeholder="Rank"
            disabled={isPosting}
            {...register('rank')}
          />

          <input
            type="text"
            placeholder="Written at (YYYY-MM-DD)"
            disabled={isPosting}
            {...register('writtenAt')}
          />

          <select {...register('categoryId')}>
            {categoriesLoading && <option>Loading...</option>}
            {categoriesData?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.title}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <Button className="p-1" variant="outline" size="sm" onClick={addImage}>
          <ImageIcon />
        </Button>
      </div>

      <Editor editor={editor} />

      <div className="flex justify-end space-x-2">
        <Button
          variant="outline"
          disabled={isPosting || !isValid}
          type="submit"
        >
          Save Post
        </Button>

        <Button variant="outline" disabled={isPosting} onClick={closeForm}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
