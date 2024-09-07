import Image from 'next/image'
import Link from 'next/link'
import { MenuIcon, XIcon } from 'lucide-react'
import { GitHubLogoIcon } from '@radix-ui/react-icons'

import { AuthButton } from '~/components/auth-button'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

export function Navbar() {
  return (
    <nav className="w-full border-b border-neutral-800">
      <div className="mx-auto flex h-12 max-w-6xl items-center justify-between gap-2 px-4 py-1.5 md:h-16 md:px-10 md:py-2">
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
                  Profile
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Billing
                  <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Settings
                  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Keyboard shortcuts
                  <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem>Email</DropdownMenuItem>
                      <DropdownMenuItem>Message</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>More...</DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuItem>
                  New Team
                  <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>GitHub</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuItem disabled>API</DropdownMenuItem>
              <DropdownMenuSeparator className="md:hidden" />
              <DropdownMenuItem className="md:hidden">
                <AuthButton className="w-full" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}
