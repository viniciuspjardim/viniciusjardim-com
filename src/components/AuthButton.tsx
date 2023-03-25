import { useUser, SignInButton, SignOutButton } from '@clerk/nextjs'

export function AuthButton() {
  const user = useUser()

  if (!user.isLoaded) {
    return (
      <button
        className="w-32 rounded border border-slate-500 bg-gray-600/75 p-2"
        type="button"
        disabled
      >
        ...
      </button>
    )
  }

  if (user.isSignedIn) {
    return (
      <SignOutButton>
        <button className="w-32 rounded border border-slate-500 bg-slate-900/75 p-2">
          Sign Out
        </button>
      </SignOutButton>
    )
  }

  return (
    <SignInButton>
      <button className="w-32 rounded border border-slate-500 bg-slate-900/75 p-2">
        Sign In
      </button>
    </SignInButton>
  )
}
