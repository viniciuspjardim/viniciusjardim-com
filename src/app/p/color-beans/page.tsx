import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Color Beans',
  description: `A Tetris like game, actually it's a clone of a SEGA game called Puyo Puyo!`,
  applicationName: 'Color Beans',
  authors: [{ name: 'Vinícius Jardim', url: 'https://www.viniciusjardim.com' }],
  keywords: [
    'Color Beans',
    `Dr. Robotnik's Mean Bean Machine`,
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
    title: 'Color Beans',
    type: 'video.other',
    description: `A Tetris like game, actually it's a clone of a SEGA game called Puyo Puyo!`,
    images: '/color-beans-card.png',
  },
}

export default function ColorBeansPage() {
  return (
    <main className="bg-[#040408]">
      <iframe
        className="h-screen w-screen"
        src="https://viniciuspjardim.github.io/color-beans-gwt"
      />
    </main>
  )
}
