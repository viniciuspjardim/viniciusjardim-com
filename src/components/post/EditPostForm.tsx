import { useState } from 'react'
import Image from 'next/image'
import { useForm, type SubmitHandler } from 'react-hook-form'

import { api } from '~/utils/api'
import { asSlug } from '~/helpers/asSlug'
import { Button } from '~/components/Button'
import { useEditor } from '~/hooks/useEditor'

type Inputs = {
  title: string
  rank: string
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
  writtenAt,
  closeForm,
}: EditPostFormProps) {
  const [moreOptions, setMoreOptions] = useState(false)

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
      writtenAt: writtenAt.toISOString(),
    },
  })

  const { Editor, editor } = useEditor(content)

  const slug = asSlug(watch('title') ?? '')
  const isValid = isFormValid && !editor?.isEmpty

  const onSubmit: SubmitHandler<Inputs> = (form) => {
    mutate({
      id,
      title: form.title,
      slug,
      content: JSON.stringify(editor?.getJSON()) || '',
      rank: form.rank ? parseInt(form.rank, 10) : undefined,
      writtenAt: form.writtenAt ? new Date(form.writtenAt) : undefined,
      categoryId: 1,
    })
  }

  const ctx = api.useContext()

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
      className="flex w-full max-w-3xl flex-col space-y-3"
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
        </div>
      )}

      <Editor editor={editor} />

      <div className="flex justify-end space-x-2">
        <Button disabled={isPosting || !isValid} type="submit">
          Save Post
        </Button>

        <Button disabled={isPosting} onClick={closeForm}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
