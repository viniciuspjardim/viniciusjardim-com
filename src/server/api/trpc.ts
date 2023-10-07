/**
 * Don't edit this file, unless:
 *
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * This is where all the tRPC server stuff is created and plugged in. The pieces you will need to
 * use are documented accordingly near the end.
 */

/**
 * 1. Context
 *
 * This section defines the "contexts" that are available in the backend API. These allow you to
 * access things when processing a request, like the database, the session, etc.
 */

import { prisma } from '~/server/db'
import { env } from '~/env.mjs'

/**
 * This is the actual context you will use in your router. It will be used to process every request
 * that goes through your tRPC endpoint.
 *
 * @see https://trpc.io/docs/context
 */
export const createTRPCContext = (opts: CreateNextContextOptions) => {
  const { req, res } = opts
  const { userId } = getAuth(req)
  const isSiteOwner = userId === env.SITE_OWNER_USER_ID

  return { prisma, isSiteOwner, userId, req, res }
}

/**
 * 2. Initialization
 *
 * This is where the tRPC API is initialized, connecting the context and transformer.
 */
import { initTRPC, TRPCError } from '@trpc/server'
import superjson from 'superjson'
import { type CreateNextContextOptions } from '@trpc/server/adapters/next'
import { getAuth } from '@clerk/nextjs/server'

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape
  },
})

/**
 * 3. Router and Procedure (the important bit)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure

const enforceUserIsAuthed = t.middleware(async ({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'The user must be authenticated to access this API endpoint',
    })
  }

  return next({ ctx: { ...ctx, userId: ctx.userId } })
})

const enforceUserIsOwner = t.middleware(async ({ ctx, next }) => {
  if (!ctx.userId || !ctx.isSiteOwner) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message:
        'The user must have site owner privileges to access this API endpoint',
    })
  }

  return next({ ctx: { ...ctx, userId: ctx.userId } })
})

export const privateProcedure = t.procedure.use(enforceUserIsAuthed)
export const ownerProcedure = t.procedure.use(enforceUserIsOwner)
