import { useUser, SignInButton, SignOutButton } from '@clerk/nextjs'

import { Button } from '~/components/Button'

export function AuthButton() {
  const user = useUser()

  if (!user.isLoaded) {
    return <Button disabled>Loading...</Button>
  }

  if (user.isSignedIn) {
    return (
      <SignOutButton>
        <Button>Sign Out</Button>
      </SignOutButton>
    )
  }

  return (
    <SignInButton>
      <Button>Sign In</Button>
    </SignInButton>
  )
}
