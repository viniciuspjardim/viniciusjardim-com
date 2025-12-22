import { mock } from 'bun:test'

// Mock server-only to allow testing server components
void mock.module('server-only', () => ({}))

// Mock environment variables to prevent server-side access errors
void mock.module('~/env', () => ({
  env: {
    NODE_ENV: 'test',
    CLERK_SECRET_KEY: 'test',
    DATABASE_URL: 'test',
    OPEN_AI_API_KEY: 'test',
    SITE_OWNER_USER_ID: 'test',
    UPLOADTHING_TOKEN: 'test',
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: 'test',
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: 'test',
    NEXT_PUBLIC_VERCEL_ENV: 'test',
    NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF: 'test',
    NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA: 'test',
    NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL: 'https://test.com',
  },
}))

// Mock uploadthing server module to prevent server-only errors
void mock.module('uploadthing/server', () => ({
  UTApi: class {
    uploadFiles() {
      return Promise.resolve([])
    }
  },
  UTFile: class {
    constructor() {
      // Mock constructor
    }
  },
}))

// Mock OpenAI to prevent browser environment errors
void mock.module('openai', () => ({
  default: class {
    audio = {
      speech: {
        create: () =>
          Promise.resolve({
            arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
          }),
      },
    }
  },
}))
