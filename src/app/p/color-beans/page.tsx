export const metadata = {
  title: 'Color Beans - Vinícius Jardim',
  description: 'A simple game to train your brain',
  icons: {
    icon: '/icon.png',
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
