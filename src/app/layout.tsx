import '~/styles/globals.css'

export const metadata = {
  title: 'Vinícius Jardim',
  description: 'Vinícius Jardim blog (draft)',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="flex flex-col items-center space-y-8 py-4">
        {children}
      </body>
    </html>
  )
}
