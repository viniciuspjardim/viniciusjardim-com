import { createRouteHandler } from 'uploadthing/next'

import { localFileRouter } from './core'

export const { GET, POST } = createRouteHandler({
  router: localFileRouter,
})
