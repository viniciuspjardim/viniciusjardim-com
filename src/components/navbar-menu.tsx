'use client'

import Link from 'next/link'

import { AuthButton } from '~/components/auth-button'
import {
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from './ui/dropdown-menu'

type NavbarMenuProps = {
  categories: { id: number; title: string; slug: string }[]
}

export function NavbarMenu({ categories }: NavbarMenuProps) {
  const showAdmin = true

  return (
    <DropdownMenuContent className="mt-6 w-64" align="end">
      <DropdownMenuGroup>
        <DropdownMenuLabel className="text-sm text-neutral-400">
          Categories
        </DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link href={`/categories`}>All</Link>
        </DropdownMenuItem>
        {categories?.map((category) => (
          <DropdownMenuItem key={category.id} asChild>
            <Link href={`/categories/${category.slug}`}>{category.title}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuGroup>

      {showAdmin && (
        <DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-sm text-neutral-400">
            Admin
          </DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link href="/admin/posts">Posts</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/admin/categories">
              <span>Categories</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/admin/caches">Caches</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/admin/upload">Upload</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      )}

      <DropdownMenuSeparator className="md:hidden" />
      <DropdownMenuItem className="md:hidden">
        <AuthButton className="w-full" />
      </DropdownMenuItem>
    </DropdownMenuContent>
  )
}
