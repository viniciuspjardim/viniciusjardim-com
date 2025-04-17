import { Navbar } from '~/components/navbar'
import { TRPCReactProvider } from '~/trpc/react'

export default function BlogLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <TRPCReactProvider>
      <Navbar />
      {children}
    </TRPCReactProvider>
  )
}
