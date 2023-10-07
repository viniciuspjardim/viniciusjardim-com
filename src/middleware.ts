import { authMiddleware } from '@clerk/nextjs'

export default authMiddleware({
  // TODO: all routes are public, but this will have to change
  publicRoutes: ['/(.*)'],
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
