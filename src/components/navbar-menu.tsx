'use client'

import Link from 'next/link'

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
    <DropdownMenuContent
      className="mt-4 w-64 p-0 shadow-lg shadow-black/50"
      align="end"
    >
      <DropdownMenuGroup>
        <DropdownMenuLabel className="text-muted-foreground flex items-center gap-2 font-light">
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
          <DropdownMenuItem asChild>
            <Link href="/admin">Admin</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      )}

      <DropdownMenuSeparator className="md:hidden" />
    </DropdownMenuContent>
  )
}
