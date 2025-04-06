'use client'

import { useUser, useClerk, SignInButton } from '@clerk/nextjs'
import { Button } from '~/components/ui/button'

import { cn } from '~/lib/utils'

export function AuthButton({ className }: { className?: string }) {
  const user = useUser()
  const { signOut } = useClerk()

  if (!user.isLoaded) {
    return (
      <Button
        className={cn('w-24', className)}
        variant="outline"
        size="sm"
        disabled
      >
        Loading...
      </Button>
    )
  }

  if (user.isSignedIn) {
    return (
      <Button
        className={cn('w-24', className)}
        variant="outline"
        size="sm"
        onClick={() => signOut()}
      >
        Sign Out
      </Button>
    )
  }

  return (
    <SignInButton mode="modal">
      <Button className={cn('w-24', className)} variant="outline" size="sm">
        Sign In
      </Button>
    </SignInButton>
  )
}
