import { createTRPCRouter } from '~/server/api/trpc'
import { postRouter } from '~/server/api/routers/postRouter'
import { categoryRouter } from './routers/categoryRouter'
import { cacheRouter } from './routers/cacheRouter'

/**
 * This is the primary router for your server. All routers added in /api/routers should be manually
 * added here.
 */
export const appRouter = createTRPCRouter({
  posts: postRouter,
  categories: categoryRouter,
  cache: cacheRouter,
})

// Export type definition of API.
export type AppRouter = typeof appRouter
