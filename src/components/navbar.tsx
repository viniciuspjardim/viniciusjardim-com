import Image from 'next/image'
import Link from 'next/link'
import { MenuIcon, XIcon } from 'lucide-react'
import { GitHubLogoIcon } from '@radix-ui/react-icons'

import { AuthButton } from '~/components/auth-button'
import { WidthContainer } from '~/components/width-container'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

export function Navbar() {
  return (
    <nav className="w-full border-b border-neutral-800">
      <WidthContainer className="flex h-12 items-center justify-between gap-4 py-1.5 md:h-16 md:py-2">
        <Link
          className="flex items-center gap-4 rounded-md transition-all hover:brightness-125"
          href="/"
        >
          <Image
            className="h-9 w-[108px] md:h-12 md:w-36"
            src="/logo.svg"
            width={144}
            height={48}
            alt="Vinícius Jardim home"
          />
        </Link>

        <div className="flex items-center justify-center gap-4">
          <a
            className="flex h-9 items-center space-x-2 rounded-md px-2 text-sm font-medium transition-all hover:bg-neutral-800 hover:text-white"
            href="https://github.com/viniciuspjardim"
            target="_blank"
          >
            <GitHubLogoIcon className="size-5" />
            <span className="hidden md:block">GitHub</span>
          </a>

          <AuthButton className="hidden md:block" />

          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button className="group px-2 py-0" variant="ghost" size="sm">
                <MenuIcon className="group-data-[state=open]:hidden" />
                <XIcon className="group-data-[state=closed]:hidden" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="mt-6 w-64" align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Link href="/admin/posts">Posts</Link>
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/admin/categories">Categories</Link>
                  <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/admin/caches">Caches</Link>
                  <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="md:hidden" />
              <DropdownMenuItem className="md:hidden">
                <AuthButton className="w-full" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </WidthContainer>
    </nav>
  )
}
