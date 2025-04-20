import type { Metadata } from 'next'
import { env } from '~/env'

export default function ColorBeansPage() {
  return (
    <main className="bg-[#131313]">
      <iframe
        className="h-screen w-screen"
        src="https://viniciuspjardim.github.io/color-beans-gwt"
      />
    </main>
  )
}

const title = 'Color Beans'
const description = `Color Beans is a Tetris like game, actually it's a clone of a SEGA game called Puyo Puyo. Link the colors, make combos and defeat the opponents!`
const baseUrl = new URL(env.NEXT_PUBLIC_VERCEL_URL)

export const metadata: Metadata = {
  title,
  description,
  applicationName: title,
  metadataBase: baseUrl,
  authors: [{ name: 'Vinícius Jardim', url: baseUrl }],
  keywords: [
    title,
    `Dr. Robotnik's Mean Bean Machine`,
    'puyo',
    'Puyo Puyo',
    'game',
    'puzzle game',
    'SEGA',
    'tetris',
  ],
  icons: {
    icon: '/color-beans-icon.png',
  },
  twitter: {
    card: 'summary_large_image',
  },
  openGraph: {
    title,
    description,
    type: 'video.other',
    url: '/p/color-beans',
    images: '/color-beans-card.png',
  },
}
