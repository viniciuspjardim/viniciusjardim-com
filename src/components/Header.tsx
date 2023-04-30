import Link from 'next/link'
import { AuthButton } from '~/components/AuthButton'

export function Header() {
  return (
    <header className="flex w-full max-w-3xl items-center justify-between gap-4 px-2">
      <Link href={'/'}>Home</Link>

      <nav className="gap4 flex items-center gap-4">
        <Link href={'/posts'}>Posts</Link>
        <Link href={'/categories'}>Categories</Link>
        <Link href={'/caches'}>Caches</Link>
        <AuthButton />
      </nav>
    </header>
  )
}
