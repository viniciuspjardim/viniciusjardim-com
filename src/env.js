import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  /** Specify your server-side environment variables schema here */
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']),
    CLERK_SECRET_KEY: z.string(),
    DATABASE_URL: z.string(),
    OPEN_AI_API_KEY: z.string(),
    SITE_OWNER_USER_ID: z.string(),
    UPLOADTHING_TOKEN: z.string(),
  },

  /** Specify your client-side environment variables schema here */
  client: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string(),
    NEXT_PUBLIC_VERCEL_ENV: z.string(),
    NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF: z.string(),
    NEXT_PUBLIC_VERCEL_GIT_COMMIT_MESSAGE: z.string(),
    NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA: z.string(),
    NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,

    // Private variables (accessible in the server only)
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
    OPEN_AI_API_KEY: process.env.OPEN_AI_API_KEY,
    SITE_OWNER_USER_ID: process.env.SITE_OWNER_USER_ID,
    UPLOADTHING_TOKEN: process.env.UPLOADTHING_TOKEN,

    // Public variables (accessible also in the browser)
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,

    // Public variables from Vercel
    // (see https://vercel.com/docs/environment-variables/system-environment-variables)
    NEXT_PUBLIC_VERCEL_ENV: process.env.NEXT_PUBLIC_VERCEL_ENV,
    NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF:
      process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF,
    NEXT_PUBLIC_VERCEL_GIT_COMMIT_MESSAGE:
      process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_MESSAGE,
    NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA:
      process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
    NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL: `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`,
  },

  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,

  /**
   * Makes it so that empty strings are treated as undefined.
   * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
})
