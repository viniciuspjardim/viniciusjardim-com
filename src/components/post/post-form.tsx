import type { JSONContent } from '@tiptap/core'
import type { s } from '~/db'

import { useCallback, type ReactNode } from 'react'
import Image from 'next/image'
import { useForm, type SubmitHandler } from 'react-hook-form'
import {
  PilcrowIcon,
  VideoIcon,
  Undo2Icon,
  Redo2Icon,
  CodeIcon,
  BracesIcon,
  LinkIcon,
  Heading3Icon,
  Heading4Icon,
  Heading5Icon,
  Heading6Icon,
  ListIcon,
  ListOrderedIcon,
  UnlinkIcon,
  FlipVerticalIcon,
} from 'lucide-react'
import { api } from '~/trpc/react'
import { asSlug } from '~/helpers/as-slug'
import { Button } from '~/components/ui/button'
import { useEditor } from '~/hooks/use-editor'
import { useToast } from '~/hooks/use-toast'
import { EditorButton } from '~/components/post/editor-button'
import { ImageDialog } from '~/components/post/image-dialog'

export interface PostFormInputs {
  title: string
  description: string | null
  keywords: string | null
  content?: JSONContent
  rank: string
  categoryId: string
  lang: string
  writtenAt: string
  published: boolean
}

export interface PostFormProps {
  defaultValues?: s.Post
  isPosting: boolean
  onSubmit: (form: PostFormInputs, editorJson: string) => Promise<s.Post>
  userName?: string
  userImageUrl?: string
  extraActions?: ReactNode
}

export function PostForm({
  defaultValues,
  isPosting,
  onSubmit,
  userName,
  userImageUrl,
  extraActions,
}: PostFormProps) {
  const [categoriesData, { isLoading: categoriesLoading }] =
    api.categories.getAllFlat.useSuspenseQuery()

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { isValid: isFormValid },
  } = useForm<PostFormInputs>({
    defaultValues: {
      title: defaultValues?.title ?? '',
      description: defaultValues?.description ?? '',
      keywords: defaultValues?.keywords ?? '',
      rank: defaultValues?.rank ? defaultValues.rank.toString() : '',
      categoryId: defaultValues?.categoryId
        ? defaultValues.categoryId.toString()
        : '1',
      lang: defaultValues?.lang ?? 'en-US',
      writtenAt: defaultValues?.writtenAt
        ? defaultValues.writtenAt.toISOString()
        : '',
      content: defaultValues?.content,
      published: defaultValues?.published ?? false,
    },
  })

  const { EditorContent, editor } = useEditor(defaultValues?.content)
  const { toast } = useToast()

  const slug = asSlug(watch('title') ?? '')
  const published = watch('published')
  const isValid = isFormValid && !editor?.isEmpty

  const handleFormSubmit: SubmitHandler<PostFormInputs> = async (formData) => {
    const editorJson = JSON.stringify(editor?.getJSON() ?? {})

    try {
      await onSubmit(formData, editorJson)
      reset()
      editor?.commands.setContent('')

      toast({
        description: defaultValues ? 'Changes saved!' : 'Post published!',
      })
    } catch (error) {
      let description = 'There was a problem with your request.'

      if (error instanceof Error && error.message.includes('`slug`')) {
        description = 'There is already a post with the same slug.'
      }

      toast({
        variant: 'destructive',
        title: 'Something went wrong.',
        description,
      })
    }
  }

  const addVideo = useCallback(() => {
    const url = window.prompt('URL')

    if (url) {
      editor?.chain().focus().setVideo(url).run()
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

  return (
    <form
      className="flex w-full flex-col space-y-3"
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <div className="flex space-x-3">
        {userImageUrl && (
          <Image
            className="h-12 w-12 rounded-full bg-neutral-950"
            src={userImageUrl}
            alt={userName ?? 'User avatar'}
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
          </div>
        </div>
      </div>

      <textarea
        placeholder="Description"
        disabled={isPosting}
        {...register('description')}
      />

      <input
        type="text"
        placeholder="Keywords"
        disabled={isPosting}
        {...register('keywords')}
      />

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

        {categoriesLoading && (
          <div className="h-[30px] text-gray-600">Categories loading...</div>
        )}

        {categoriesData && (
          <select {...register('categoryId')}>
            {categoriesData.map((category) => (
              <option key={category.id} value={category.id}>
                {category.title}
              </option>
            ))}
          </select>
        )}

        <select {...register('lang')}>
          <option value="en-US" lang="en-US">
            English
          </option>
          <option value="pt-BR" lang="pt-BR">
            Português
          </option>
        </select>

        <label className="flex items-center space-x-2">
          <input
            className="size-4"
            type="checkbox"
            placeholder="Written at (YYYY-MM-DD)"
            disabled={isPosting}
            {...register('published')}
          />
          <span>Published</span>
        </label>
      </div>

      {/* Editor container */}
      <div className="max-h-[90svh] overflow-y-auto rounded-md border border-neutral-800">
        {/* Editor toolbar */}
        <div className="sticky top-0 z-10 flex items-center gap-x-1.5 gap-y-1 overflow-x-auto border-b border-neutral-800 bg-black p-1 [scrollbar-width:none] md:flex-wrap md:overflow-visible">
          <EditorButton
            title="Paragraph"
            isActive={editor?.isActive('paragraph')}
            onClick={() => editor?.chain().focus().setParagraph().run()}
          >
            <PilcrowIcon className="size-5" />
          </EditorButton>
          <EditorButton
            title="Heading 3"
            isActive={editor?.isActive('heading', { level: 3 })}
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 3 }).run()
            }
          >
            <Heading3Icon className="size-5" />
          </EditorButton>
          <ImageDialog editor={editor} />
          <EditorButton
            title="Code"
            isActive={editor?.isActive('code')}
            onClick={() => editor?.chain().focus().toggleCode().run()}
          >
            <CodeIcon className="size-5" />
          </EditorButton>
          <EditorButton
            title="Code block"
            isActive={editor?.isActive('codeBlock')}
            onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
          >
            <BracesIcon className="size-5" />
          </EditorButton>
          <EditorButton
            title="Link"
            isActive={editor?.isActive('link')}
            onClick={setLink}
          >
            <LinkIcon className="size-5" />
          </EditorButton>
          <EditorButton
            title="Line break"
            onClick={() => editor?.chain().focus().setHardBreak().run()}
          >
            br
          </EditorButton>
          <EditorButton title="Add video" onClick={addVideo}>
            <VideoIcon className="size-5" />
          </EditorButton>
          <EditorButton
            className="text-semibold"
            title="Bold"
            isActive={editor?.isActive('bold')}
            onClick={() => editor?.chain().focus().toggleBold().run()}
          >
            B
          </EditorButton>
          <EditorButton
            className="font-serif italic"
            title="Italic"
            isActive={editor?.isActive('italic')}
            onClick={() => editor?.chain().focus().toggleItalic().run()}
          >
            I
          </EditorButton>
          <EditorButton
            className="line-through"
            title="Strike"
            isActive={editor?.isActive('strike')}
            onClick={() => editor?.chain().focus().toggleStrike().run()}
          >
            S
          </EditorButton>
          <EditorButton
            title="Heading 4"
            isActive={editor?.isActive('heading', { level: 4 })}
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 4 }).run()
            }
          >
            <Heading4Icon className="size-5" />
          </EditorButton>
          <EditorButton
            title="Heading 5"
            isActive={editor?.isActive('heading', { level: 5 })}
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 5 }).run()
            }
          >
            <Heading5Icon className="size-5" />
          </EditorButton>
          <EditorButton
            title="Heading 6"
            isActive={editor?.isActive('heading', { level: 6 })}
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 6 }).run()
            }
          >
            <Heading6Icon className="size-5" />
          </EditorButton>
          <EditorButton
            title="Unordered list"
            isActive={editor?.isActive('bulletList')}
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
          >
            <ListIcon className="size-5" />
          </EditorButton>
          <EditorButton
            title="Ordered list"
            isActive={editor?.isActive('orderedList')}
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          >
            <ListOrderedIcon className="size-5" />
          </EditorButton>
          <EditorButton
            title="Quote"
            isActive={editor?.isActive('blockquote')}
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          >
            {'"'}
          </EditorButton>
          <EditorButton
            title="Horizontal rule"
            onClick={() => editor?.chain().focus().setHorizontalRule().run()}
          >
            <FlipVerticalIcon className="size-5" />
          </EditorButton>
          <EditorButton
            title="Undo"
            onClick={() => editor?.chain().focus().undo().run()}
          >
            <Undo2Icon className="size-5" />
          </EditorButton>
          <EditorButton
            title="Redo"
            onClick={() => editor?.chain().focus().redo().run()}
          >
            <Redo2Icon className="size-5" />
          </EditorButton>
          <EditorButton
            title="Remove link"
            onClick={() => editor?.chain().focus().unsetLink().run()}
            disabled={!editor?.isActive('link')}
          >
            <UnlinkIcon className="size-5" />
          </EditorButton>
          <EditorButton
            title="Clear formatting"
            onClick={() => editor?.chain().focus().unsetAllMarks().run()}
          >
            CF
          </EditorButton>
          <EditorButton
            title="Clear nodes"
            onClick={() => editor?.chain().focus().clearNodes().run()}
          >
            CN
          </EditorButton>
        </div>

        {/* Content of the post in the editor */}
        {editor ? (
          <EditorContent editor={editor} />
        ) : (
          <div className="min-h-48" />
        )}

        {/* Editor footer */}
        <div className="sticky bottom-0 flex justify-end space-x-2 p-2">
          {/* Insert extra actions (like a Cancel button) if needed */}
          {extraActions}

          <Button
            variant="outline"
            disabled={isPosting || !isValid}
            type="submit"
          >
            {published ? 'Save and publish' : 'Save draft'}
          </Button>
        </div>
      </div>
    </form>
  )
}
