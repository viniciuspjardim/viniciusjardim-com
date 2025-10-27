'use client'

import type { JSONContent } from '@tiptap/core'
import type { s } from '~/db'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { parseISO } from 'date-fns'
import { ChevronLeftIcon, SaveIcon } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '~/trpc/react'
import { asSlug } from '~/helpers/as-slug'
import { Button } from '~/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { useVirtualKeyboardBounds } from '~/hooks/use-virtual-keyboard-bounds'
import { WidthContainer } from '~/components/width-container'

import { EditorMeta } from './editor-meta'
import { EditorPreview } from './editor-preview'
import { EditorToolbar } from './editor-toolbar'
import { useTipTapEditor } from './use-tiptap-editor'

function createPostObject<T>(
  postId: T,
  form: PostFormInputs,
  content: JSONContent
) {
  return {
    id: postId,
    slug: asSlug(form.title),
    title: form.title,
    description: form.description || undefined,
    keywords: form.keywords || undefined,
    content,
    rank: form.rank ? parseInt(form.rank, 10) : undefined,
    lang: form.lang ? form.lang : undefined,
    writtenAt: form.writtenAt ? parseISO(form.writtenAt) : undefined,
    categoryId: parseInt(form.categoryId, 10),
    published: form.published ?? false,
  }
}

type PostObject = ReturnType<typeof createPostObject<number | undefined>>

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

export interface EditorProps {
  initialPostData?: s.Post
  userName?: string
  userImageUrl?: string
}

type SelectedTab = 'meta' | 'editor' | 'preview'

export function Editor({
  initialPostData,
  userName,
  userImageUrl,
}: EditorProps) {
  const searchParams = useSearchParams()
  const bounds = useVirtualKeyboardBounds()

  const postIdParam = searchParams.get('postId')
  const postId = postIdParam ? parseInt(postIdParam, 10) : undefined
  const selectedTab = (searchParams.get('tab') ?? 'meta') as SelectedTab

  const [postPreview, setPostPreview] = useState<PostObject | null>(null)
  const [categoriesData] = api.categories.getAll.useSuspenseQuery()

  // Create post mutation
  const { mutateAsync: createPost, isPending: isCreatePostLoading } =
    api.posts.create.useMutation()

  async function handleCreatePost(form: PostFormInputs, content: JSONContent) {
    return createPost(createPostObject(postId, form, content))
  }

  // Edit post mutation
  const { mutateAsync: editPost, isPending: isEditPostLoading } =
    api.posts.update.useMutation()

  async function handleEditPost(form: PostFormInputs, content: JSONContent) {
    if (!postId) {
      throw new Error('Initial post data is required for editing')
    }

    return editPost(createPostObject(postId, form, content))
  }

  const isPosting = postId ? isEditPostLoading : isCreatePostLoading
  const onSubmit = postId ? handleEditPost : handleCreatePost

  // Form data
  const {
    register,
    handleSubmit,
    control,
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

  const { TipTapEditorContent, tipTapEditor } = useTipTapEditor(
    initialPostData?.content
  )

  const isValid = isFormValid && !tipTapEditor?.isEmpty

  const handleFormSubmit: SubmitHandler<PostFormInputs> = async (formData) => {
    const content = tipTapEditor?.getJSON() ?? {}

    try {
      const post = await onSubmit(formData, content)
      toast(postId ? 'Post changes were saved' : 'Post created successfully')

      // After creating the post add the postId query param without reloading the page
      if (!postId) {
        const params = new URLSearchParams(searchParams)
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

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams)
    params.set('tab', value)
    window.history.replaceState(null, '', `?${params.toString()}`)
  }

  // Generate post preview when selected tab is 'preview'
  useEffect(() => {
    if (selectedTab === 'preview') {
      // Get the form data and content from the editor to build the post preview
      void handleSubmit((formData) => {
        const content = tipTapEditor?.getJSON() ?? {}
        const post = createPostObject(postId, formData, content)
        setPostPreview(post)
      })()
    }
  }, [selectedTab, handleSubmit, tipTapEditor, postId])

  return (
    <form
      className="bg-background fixed top-0 left-0 z-20 h-dvh w-full"
      onSubmit={handleSubmit(handleFormSubmit)}
      name="post-form"
    >
      <Tabs
        className="flex h-full flex-col gap-0"
        value={selectedTab}
        onValueChange={handleTabChange}
      >
        {/* Header and toolbars */}
        <div className="shrink-0 border-b">
          <WidthContainer className="flex items-center justify-between">
            <Link href="/admin">
              <ChevronLeftIcon />
            </Link>

            <TabsList className="h-12 p-0 text-lg">
              <TabsTrigger className="border-2 text-base" value="meta">
                Meta
              </TabsTrigger>
              <TabsTrigger className="border-2 text-base" value="editor">
                Editor
              </TabsTrigger>
              <TabsTrigger className="border-2 text-base" value="preview">
                Preview
              </TabsTrigger>
            </TabsList>

            <Button size="sm" disabled={isPosting || !isValid} type="submit">
              <SaveIcon />
              <span>Save</span>
            </Button>
          </WidthContainer>

          {/* Text editor toolbar */}
          {selectedTab === 'editor' && (
            <div className="border-t">
              <WidthContainer className="flex items-center gap-x-1.5 gap-y-1 overflow-x-auto px-1 py-2 [scrollbar-width:none] md:flex-wrap md:overflow-visible">
                <EditorToolbar tipTapEditor={tipTapEditor} />
              </WidthContainer>
            </div>
          )}
        </div>

        {/* Content */}
        <WidthContainer className="w-full flex-grow overflow-y-auto">
          {/* Post metadata form */}
          <TabsContent value="meta">
            <EditorMeta
              register={register}
              control={control}
              isPosting={isPosting}
              categoriesData={categoriesData}
              userName={userName}
              userImageUrl={userImageUrl}
            />
          </TabsContent>

          {/* Text editor content */}
          <TabsContent value="editor">
            {tipTapEditor && <TipTapEditorContent editor={tipTapEditor} />}
          </TabsContent>

          {/* Post preview */}
          <TabsContent value="preview">
            <EditorPreview
              postPreview={postPreview}
              userName={userName}
              userImageUrl={userImageUrl}
              initialPostData={initialPostData}
            />
          </TabsContent>
        </WidthContainer>

        {/* Virtual keyboard placeholder, it will grow to take virtual keyboard space when it appears */}
        <div className="shrink-0" style={{ height: `${bounds.height}px` }} />
      </Tabs>
    </form>
  )
}
