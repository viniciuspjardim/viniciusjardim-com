import Image from 'next/image'
import Link from 'next/link'
import { AuthButton } from '~/components/AuthButton'

export function Header() {
  return (
    <nav className="w-full border-b border-gray-900">
      <div className="mx-auto flex h-12 max-w-6xl items-center justify-between px-4 py-1.5 md:h-16 md:px-10 md:py-2">
        <Link href="/" className="flex items-center gap-4">
          <Image
            className="h-9 w-[108px] md:h-12 md:w-36"
            src="/logo.svg"
            width={144}
            height={48}
            alt="Vinícius Jardim Home"
          />
        </Link>

        <AuthButton />
      </div>
    </nav>
  )
}
