'use client'

import { useUser, useClerk, SignInButton } from '@clerk/nextjs'
import { Button } from '~/components/Button'

export function AuthButton() {
  const user = useUser()
  const { signOut } = useClerk()

  if (!user.isLoaded) {
    return <Button disabled>Loading...</Button>
  }

  if (user.isSignedIn) {
    return <Button onClick={() => signOut()}>Sign Out</Button>
  }

  return (
    <SignInButton>
      <Button>Sign In</Button>
    </SignInButton>
  )
}
