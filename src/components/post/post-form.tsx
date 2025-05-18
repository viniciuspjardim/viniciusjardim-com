'use client'

import type { JSONContent } from '@tiptap/core'
import type { s } from '~/db'

import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useForm, Controller, type SubmitHandler } from 'react-hook-form'
import { ChevronLeftIcon } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '~/trpc/react'
import { asSlug } from '~/helpers/as-slug'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Textarea } from '~/components/ui/textarea'
import { useEditor } from '~/hooks/use-editor'
import { PostFormEditor } from './post-form-editor'
import { WidthContainer } from '../width-container'

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

  const { editor } = useEditor(initialPostData?.content)

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

  return (
    <form
      className="h-[calc(100dvh-var(--spacing-nav))] space-y-3"
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <Tabs className="flex h-full flex-col gap-0" defaultValue="meta">
        <div className="shrink-0 border-b">
          <WidthContainer className="flex items-center justify-between">
            <Link href="/admin">
              <ChevronLeftIcon />
            </Link>

            <TabsList className="h-10 p-0 text-lg">
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
          </WidthContainer>
        </div>

        {/* Form - post meta data */}
        <TabsContent className="h-full space-y-4 px-4 py-6" value="meta">
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
        </TabsContent>

        {/* Editor */}
        <TabsContent className="max-h-full overflow-y-auto" value="editor">
          <PostFormEditor
            editor={editor}
            isPosting={isPosting}
            isValid={isValid}
            published={published}
          />
        </TabsContent>

        {/* Preview */}
        <TabsContent value="preview">TODO: preview tab</TabsContent>
      </Tabs>
    </form>
  )
}
