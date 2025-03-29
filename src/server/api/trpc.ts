/*
 * Don't edit this file, unless:
 *
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * This is where all the tRPC server stuff is created and plugged in. The pieces you will need to
 * use are documented accordingly near the end.
 */

import { initTRPC, TRPCError } from '@trpc/server'
import superjson from 'superjson'
import { ZodError } from 'zod'
import { auth } from '@clerk/nextjs/server'
import { db } from '~/db'
import { env } from '~/env'

/*
 * 1. Context
 *
 * This section defines the "contexts" that are available in the backend API. These allow you to
 * access things when processing a request, like the database, the session, etc.
 */

export const createTRPCContext = async (opts: { headers: Headers }) => {
  // eslint-disable-next-line @typescript-eslint/await-thenable
  const authData = await auth()

  const isSiteOwner = authData.userId === env.SITE_OWNER_USER_ID

  return {
    db,
    auth: authData,
    isSiteOwner,
    userId: authData.userId,
    ...opts,
  }
}

/*
 * 2. Initialization
 *
 * This is where the tRPC API is initialized, connecting the context and transformer.
 */

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    }
  },
})

/**
 * Create a server-side caller.
 *
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory

/*
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
