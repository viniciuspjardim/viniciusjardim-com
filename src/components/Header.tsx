import Image from 'next/image'
import Link from 'next/link'
import { AuthButton } from '~/components/AuthButton'

const navItems = [
  { title: 'Home', path: '/' },
  { title: 'Posts', path: '/admin/posts' },
  { title: 'Categories', path: '/admin/categories' },
  { title: 'Caches', path: '/admin/caches' },
]

export function Header() {
  return (
    <nav className="w-full">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between p-2">
        <Link href="/" className="flex items-center gap-4">
          <Image
            className="rounded-full border-2 border-rose-500/40"
            src="/favicon.svg"
            width={32}
            height={32}
            alt="blog logo"
          />

          <span className="self-center whitespace-nowrap text-xl font-semibold text-white/90">
            blog
          </span>
        </Link>

        <button
          data-collapse-toggle="navbar-dropdown"
          type="button"
          className="ml-3 inline-flex items-center rounded-lg p-2 text-sm text-white/90 hover:bg-gray-200/10 focus:outline-none focus:ring-2 focus:ring-gray-200/10 md:hidden"
          aria-controls="navbar-dropdown"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="h-6 w-6"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        <div className=" w-full md:block md:w-auto" id="navbar-dropdown">
          <ul className="mt-4 flex flex-col rounded-lg border border-gray-700 p-4 font-medium md:mt-0 md:flex-row md:space-x-8 md:border-none md:p-0">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  className="block rounded py-2 pl-3 pr-4 text-white hover:bg-gray-200/10 md:border-0 md:p-0 md:hover:bg-transparent md:dark:hover:bg-transparent"
                  href={item.path}
                  aria-current="page"
                >
                  {item.title}
                </Link>
              </li>
            ))}

            <li>
              <AuthButton />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
