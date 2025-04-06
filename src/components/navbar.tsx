import Image from 'next/image'
import Link from 'next/link'
import { MenuIcon, XIcon } from 'lucide-react'
import { GitHubLogoIcon } from '@radix-ui/react-icons'

import { AuthButton } from '~/components/auth-button'
import { NavbarMenu } from '~/components/navbar-menu'
import { WidthContainer } from '~/components/width-container'
import { Button } from '~/components/ui/button'
import { DropdownMenu, DropdownMenuTrigger } from './ui/dropdown-menu'
import { api } from '~/trpc/server'

export async function Navbar() {
  const categories = await api.categories.getAllFlat()

  return (
    <nav className="w-full border-b">
      <WidthContainer className="flex h-12 items-center justify-between gap-4 py-1.5 md:h-16 md:py-2">
        <Link
          className="flex items-center gap-4 rounded-md transition-all hover:brightness-125"
          href="/"
        >
          <Image
            className="h-9 w-[108px] md:h-12 md:w-36"
            src="/logo.svg"
            alt="Vinícius Jardim home"
            priority
            width={144}
            height={48}
          />
        </Link>

        <div className="flex items-center justify-center gap-4">
          <Button className="h-8 py-0" variant="ghost" asChild>
            <a
              className="flex items-center gap-1 rounded-md px-2 py-0 text-sm font-medium transition-all hover:bg-neutral-800 hover:text-white"
              href="https://github.com/viniciuspjardim"
              target="_blank"
            >
              <GitHubLogoIcon className="size-5" />
              <span className="hidden md:block">GitHub</span>
            </a>
          </Button>

          <AuthButton className="hidden md:block" />

          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button className="group px-1" variant="ghost" size="sm">
                <MenuIcon className="size-6 group-data-[state=open]:hidden" />
                <XIcon className="size-6 group-data-[state=closed]:hidden" />
              </Button>
            </DropdownMenuTrigger>

            <NavbarMenu categories={categories} />
          </DropdownMenu>
        </div>
      </WidthContainer>
    </nav>
  )
}
