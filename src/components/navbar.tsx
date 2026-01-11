import Image from 'next/image'
import Link from 'next/link'
import { MenuIcon, XIcon } from 'lucide-react'
import { GitHubLogoIcon } from '@radix-ui/react-icons'
import { cacheLife, cacheTag } from 'next/cache'

import { NavbarMenu } from '~/components/navbar-menu'
import { WidthContainer } from '~/components/width-container'
import { Button } from '~/components/ui/button'
import { DropdownMenu, DropdownMenuTrigger } from './ui/dropdown-menu'
import { db } from '~/db'
import { Suspense } from 'react'

async function NavbarMenuContent() {
  'use cache'
  cacheLife('max')
  cacheTag('categories-list')

  const categories = await db.category.getAll()

  return <NavbarMenu categories={categories} />
}

export function Navbar() {
  return (
    <nav className="h-nav bg-background/90 sticky top-0 z-5 w-full border-b shadow-xl shadow-indigo-900/10 backdrop-blur-md">
      <WidthContainer
        className="flex h-full items-center justify-between gap-4"
        paddingX
        mdPaddingX
      >
        <Link
          className="flex items-center gap-4 rounded-md transition-all hover:brightness-125"
          href="/"
        >
          <Image
            className="h-9 w-27 md:h-10 md:w-30"
            src="/logo.svg"
            alt="Vinícius Jardim home"
            loading="eager"
            fetchPriority="low"
            width={120}
            height={40}
          />
        </Link>

        <div className="flex items-center justify-center gap-4">
          <Button className="h-8 py-0" variant="ghost" asChild>
            <a
              className="hover:bg-card flex items-center gap-1 rounded-md px-2 py-0 text-sm font-medium transition-all hover:text-white"
              href="https://github.com/viniciuspjardim"
              target="_blank"
              aria-label="GitHub"
            >
              <GitHubLogoIcon className="size-5" />
              <span className="hidden md:block">GitHub</span>
            </a>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="group px-1"
                variant="ghost"
                size="sm"
                aria-label="Menu"
              >
                <MenuIcon className="size-6 group-data-[state=open]:hidden" />
                <XIcon className="size-6 group-data-[state=closed]:hidden" />
              </Button>
            </DropdownMenuTrigger>

            <Suspense fallback="Loading...">
              <NavbarMenuContent />
            </Suspense>
          </DropdownMenu>
        </div>
      </WidthContainer>
    </nav>
  )
}
