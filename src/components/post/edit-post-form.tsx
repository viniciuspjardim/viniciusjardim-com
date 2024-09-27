import { useState, useCallback } from 'react'
import Image from 'next/image'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { ImageIcon } from 'lucide-react'

import { api } from '~/utils/api'
import { asSlug } from '~/helpers/as-slug'
import { Button, type ButtonProps } from '~/components/ui/button'
import { useEditor } from '~/hooks/use-editor'

import { cn } from '~/helpers/cn'

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

export function EditorButton(props: ButtonProps) {
  return (
    <Button
      className={cn('p-1', props.className)}
      variant="outline"
      size="sm"
      type="button"
      {...props}
    />
  )
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

  const addImage = useCallback(() => {
    const url = window.prompt('URL')

    if (url) {
      editor?.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  const setLink = useCallback(() => {
    const previousUrl = editor?.getAttributes('link').href as string | undefined
    const url = window.prompt('URL', previousUrl)

    if (url === null) {
      return
    }

    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  if (!editor) {
    return null
  }

  if (!editor) return null

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

      <div className="flex flex-wrap items-center gap-2">
        <EditorButton onClick={addImage}>
          <ImageIcon />
        </EditorButton>
        <EditorButton
          className={editor.isActive('bold') ? 'dark:border-rose-950' : ''}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          Bold
        </EditorButton>
        <EditorButton
          className={editor.isActive('italic') ? 'dark:border-rose-950' : ''}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          Italic
        </EditorButton>
        <EditorButton
          className={editor.isActive('strike') ? 'dark:border-rose-950' : ''}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          Strike
        </EditorButton>
        <EditorButton
          className={editor.isActive('code') ? 'dark:border-rose-950' : ''}
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          Code
        </EditorButton>
        <EditorButton
          className={editor.isActive('link') ? 'dark:border-rose-950' : ''}
          onClick={setLink}
        >
          Set link
        </EditorButton>
        <EditorButton
          onClick={() => editor.chain().focus().unsetLink().run()}
          disabled={!editor.isActive('link')}
        >
          Unset link
        </EditorButton>
        <EditorButton
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
        >
          Clear marks
        </EditorButton>
        <EditorButton onClick={() => editor.chain().focus().clearNodes().run()}>
          Clear nodes
        </EditorButton>
        <EditorButton
          className={editor.isActive('paragraph') ? 'dark:border-rose-950' : ''}
          onClick={() => editor.chain().focus().setParagraph().run()}
        >
          Paragraph
        </EditorButton>
        <EditorButton
          className={
            editor.isActive('heading', { level: 1 })
              ? 'dark:border-rose-950'
              : ''
          }
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          H1
        </EditorButton>
        <EditorButton
          className={
            editor.isActive('heading', { level: 2 })
              ? 'dark:border-rose-950'
              : ''
          }
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          H2
        </EditorButton>
        <EditorButton
          className={
            editor.isActive('heading', { level: 3 })
              ? 'dark:border-rose-950'
              : ''
          }
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          H3
        </EditorButton>
        <EditorButton
          className={
            editor.isActive('heading', { level: 4 })
              ? 'dark:border-rose-950'
              : ''
          }
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 4 }).run()
          }
        >
          H4
        </EditorButton>
        <EditorButton
          className={
            editor.isActive('heading', { level: 5 })
              ? 'dark:border-rose-950'
              : ''
          }
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 5 }).run()
          }
        >
          H5
        </EditorButton>
        <EditorButton
          className={
            editor.isActive('heading', { level: 6 })
              ? 'dark:border-rose-950'
              : ''
          }
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 6 }).run()
          }
        >
          H6
        </EditorButton>
        <EditorButton
          className={
            editor.isActive('bulletList') ? 'dark:border-rose-950' : ''
          }
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          Bullet list
        </EditorButton>
        <EditorButton
          className={editor.isActive('orderedList') ? 'is-active' : ''}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          Ordered list
        </EditorButton>
        <EditorButton
          className={editor.isActive('codeBlock') ? 'is-active' : ''}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          Code block
        </EditorButton>
        <EditorButton
          className={editor.isActive('blockquote') ? 'is-active' : ''}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          Blockquote
        </EditorButton>
        <EditorButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          Horizontal rule
        </EditorButton>
        <EditorButton
          onClick={() => editor.chain().focus().setHardBreak().run()}
        >
          Hard break
        </EditorButton>
        <EditorButton onClick={() => editor.chain().focus().undo().run()}>
          Undo
        </EditorButton>
        <EditorButton onClick={() => editor.chain().focus().redo().run()}>
          Redo
        </EditorButton>
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

        <Button
          variant="outline"
          disabled={isPosting}
          type="button"
          onClick={closeForm}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
