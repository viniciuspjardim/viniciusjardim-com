import { createNextRouteHandler } from 'uploadthing/next'

import { localFileRouter } from './core'

export const { GET, POST } = createNextRouteHandler({
  router: localFileRouter,
})
