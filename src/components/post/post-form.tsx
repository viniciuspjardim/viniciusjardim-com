'use client'

import type { JSONContent } from '@tiptap/core'
import type { s } from '~/db'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { ChevronLeftIcon, SaveIcon } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '~/trpc/react'
import { asSlug } from '~/helpers/as-slug'
import { Button } from '~/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { useEditor } from '~/hooks/use-editor'
import { PostFormEditor } from './post-form-editor'
import { PostFormMeta } from './post-form-meta'
import { PostFormPreview } from './post-form-preview'
import { WidthContainer } from '../width-container'
import { parseISO } from 'date-fns'

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
  const [postPreview, setPostPreview] = useState<PostObject | null>(null)

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

  const { editor } = useEditor(initialPostData?.content)

  const slug = asSlug(watch('title') ?? '')
  const isValid = isFormValid && !editor?.isEmpty

  const handleFormSubmit: SubmitHandler<PostFormInputs> = async (formData) => {
    const content = editor?.getJSON() ?? {}

    try {
      const post = await onSubmit(formData, content)
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

  return (
    <form
      className="h-[calc(100dvh-var(--spacing-nav))] space-y-3"
      onSubmit={handleSubmit(handleFormSubmit)}
      name="post-form"
    >
      <Tabs className="flex h-full flex-col gap-0" defaultValue="meta">
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
              <TabsTrigger
                className="border-2 text-base"
                value="preview"
                onClick={handleSubmit((formData) => {
                  const content = editor?.getJSON() ?? {}
                  const post = createPostObject(postId, formData, content)
                  setPostPreview(post)
                })}
              >
                Preview
              </TabsTrigger>
            </TabsList>

            <Button size="sm" disabled={isPosting || !isValid} type="submit">
              <SaveIcon />
              <span>Save</span>
            </Button>
          </WidthContainer>
        </div>

        {/* Form - post meta data */}
        <TabsContent className="h-full py-6" value="meta">
          <PostFormMeta
            register={register}
            control={control}
            isPosting={isPosting}
            slug={slug}
            categoriesData={categoriesData}
            userName={userName}
            userImageUrl={userImageUrl}
          />
        </TabsContent>

        {/* Editor */}
        <TabsContent className="max-h-full overflow-y-auto" value="editor">
          <PostFormEditor editor={editor} />
        </TabsContent>

        {/* Preview */}
        <TabsContent className="py-16" value="preview">
          <PostFormPreview
            postPreview={postPreview}
            userName={userName}
            userImageUrl={userImageUrl}
            initialPostData={initialPostData}
          />
        </TabsContent>
      </Tabs>
    </form>
  )
}
