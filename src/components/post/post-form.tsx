'use client'

import type { JSONContent } from '@tiptap/core'
import type { s } from '~/db'

import { useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { useForm, Controller, type SubmitHandler } from 'react-hook-form'
import {
  PilcrowIcon,
  VideoIcon,
  Undo2Icon,
  Redo2Icon,
  CodeIcon,
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
import { toast } from 'sonner'
import { api } from '~/trpc/react'
import { asSlug } from '~/helpers/as-slug'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from '~/components/ui/select'
import { Textarea } from '~/components/ui/textarea'
import { useEditor } from '~/hooks/use-editor'
import { EditorButton } from '~/components/post/editor-button'
import { ImageDialog } from '~/components/post/image-dialog'
import { CodeBlockDialog } from '~/components/post/code-block-dialog'

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
  initialPostData?: s.Post
  userName?: string
  userImageUrl?: string
}

export function PostForm({
  initialPostData,
  userName,
  userImageUrl,
}: PostFormProps) {
  const postIdParam = useSearchParams().get('postId')
  const postId = postIdParam ? parseInt(postIdParam, 10) : undefined
  const [categoriesData] = api.categories.getAll.useSuspenseQuery()

  // Create post mutation
  const { mutateAsync: createPost, isPending: isCreatePostLoading } =
    api.posts.create.useMutation()

  async function handleCreatePost(form: PostFormInputs, content: string) {
    return createPost({
      slug: asSlug(form.title),
      title: form.title,
      description: form.description || undefined,
      keywords: form.keywords || undefined,
      content: JSON.parse(content) as JSONContent,
      rank: form.rank ? parseInt(form.rank, 10) : undefined,
      categoryId: parseInt(form.categoryId, 10),
      lang: form.lang ? form.lang : undefined,
      writtenAt: form.writtenAt ? new Date(form.writtenAt) : undefined,
      published: form.published ?? false,
    })
  }

  // Edit post mutation
  const { mutateAsync: editPost, isPending: isEditPostLoading } =
    api.posts.update.useMutation()

  async function handleEditPost(form: PostFormInputs, content: string) {
    if (!postId) {
      throw new Error('Initial post data is required for editing')
    }

    return editPost({
      id: postId,
      slug: asSlug(form.title),
      title: form.title,
      description: form.description || undefined,
      keywords: form.keywords || undefined,
      content: JSON.parse(content) as JSONContent,
      rank: form.rank ? parseInt(form.rank, 10) : undefined,
      lang: form.lang ? form.lang : undefined,
      writtenAt: form.writtenAt ? new Date(form.writtenAt) : undefined,
      categoryId: parseInt(form.categoryId, 10),
      published: form.published ?? false,
    })
  }

  const isPosting = postId ? isEditPostLoading : isCreatePostLoading
  const onSubmit = postId ? handleEditPost : handleCreatePost

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { isValid: isFormValid },
  } = useForm<PostFormInputs>({
    defaultValues: {
      title: initialPostData?.title ?? '',
      description: initialPostData?.description ?? '',
      keywords: initialPostData?.keywords ?? '',
      rank: initialPostData?.rank ? initialPostData.rank.toString() : '',
      categoryId: initialPostData?.categoryId
        ? initialPostData.categoryId.toString()
        : '1',
      lang: initialPostData?.lang ?? 'en-US',
      writtenAt: initialPostData?.writtenAt
        ? initialPostData.writtenAt.toISOString()
        : '',
      content: initialPostData?.content,
      published: initialPostData?.published ?? false,
    },
  })

  const { EditorContent, editor } = useEditor(initialPostData?.content)

  const slug = asSlug(watch('title') ?? '')
  const published = watch('published')
  const isValid = isFormValid && !editor?.isEmpty

  const handleFormSubmit: SubmitHandler<PostFormInputs> = async (formData) => {
    const editorJson = JSON.stringify(editor?.getJSON() ?? {})

    try {
      const post = await onSubmit(formData, editorJson)
      toast(postId ? 'Post changes were saved' : 'Post created successfully')

      // After creating the post add the postId query param without reloading the page
      if (!postId) {
        const params = new URLSearchParams()
        params.set('postId', post.id.toString())
        window.history.replaceState(null, '', `?${params.toString()}`)
      }
    } catch (error) {
      let description = 'There was a problem with your request.'

      if (error instanceof Error && error.message.includes('`slug`')) {
        description = 'There is already a post with the same slug.'
      }

      toast(description)
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

        {/* Title */}
        <div className="flex w-full flex-col gap-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            type="text"
            placeholder="My post title"
            disabled={isPosting}
            {...register('title', { required: true })}
          />

          <div className="flex justify-between">
            <span className="text-muted-foreground text-sm">
              {slug || 'Post Slug'}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="This is a description of my post."
          disabled={isPosting}
          {...register('description')}
        />
      </div>

      {/* Keywords */}
      <div className="space-y-2">
        <Label htmlFor="keywords">Keywords</Label>
        <Input
          id="keywords"
          type="text"
          placeholder="Coding, JavaScript, React"
          disabled={isPosting}
          {...register('keywords')}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {/* Rank */}
        <div className="space-y-2">
          <Label htmlFor="rank">Rank</Label>
          <Input
            id="rank"
            type="text"
            placeholder="5000"
            disabled={isPosting}
            {...register('rank')}
          />
        </div>

        {/* Written at */}
        <div className="space-y-2">
          <Label htmlFor="writtenAt">Written at</Label>
          <Input
            id="writtenAt"
            type="text"
            placeholder="YYYY-MM-DD"
            disabled={isPosting}
            {...register('writtenAt')}
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label htmlFor="categoryId">Category</Label>
          <Controller
            name="categoryId"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select value={value} onValueChange={onChange}>
                <SelectTrigger className="w-full" id="categoryId">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Categories</SelectLabel>
                    {categoriesData.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id.toString()}
                      >
                        {category.title}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Language */}
        <div className="space-y-2">
          <Label htmlFor="lang">Language</Label>
          <Controller
            name="lang"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select value={value} onValueChange={onChange}>
                <SelectTrigger className="w-full" id="lang">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Languages</SelectLabel>
                    <SelectItem value="en-US" lang="en-US">
                      🇺🇸 English
                    </SelectItem>
                    <SelectItem value="pt-BR" lang="pt-BR">
                      🇧🇷 Português
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
        </div>

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
      <div className="max-h-[90svh] overflow-y-auto rounded-md border">
        {/* Editor toolbar */}
        <div className="sticky top-0 z-10 flex items-center gap-x-1.5 gap-y-1 overflow-x-auto border-b bg-black p-1 [scrollbar-width:none] md:flex-wrap md:overflow-visible">
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
          <CodeBlockDialog editor={editor} />
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
          <EditorButton title="Video" onClick={addVideo}>
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
