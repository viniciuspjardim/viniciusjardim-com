'use client'

import type { Control, UseFormRegister } from 'react-hook-form'
import type { s } from '~/db'
import type { PostFormInputs } from './post-form'

import Image from 'next/image'
import { Controller } from 'react-hook-form'
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

export interface PostFormMetaProps {
  register: UseFormRegister<PostFormInputs>
  control: Control<PostFormInputs>
  isPosting: boolean
  slug: string
  categoriesData: s.Category[]
  userName?: string
  userImageUrl?: string
}

export function PostFormMeta({
  register,
  control,
  isPosting,
  slug,
  categoriesData,
  userName,
  userImageUrl,
}: PostFormMetaProps) {
  return (
    <div className="space-y-4 py-6">
      <div className="flex space-x-3">
        {userImageUrl && (
          <Image
            className="bg-card h-12 w-12 rounded-full"
            src={userImageUrl}
            alt={userName ?? 'User avatar'}
            width={48}
            height={48}
            quality={90}
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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
    </div>
  )
}
