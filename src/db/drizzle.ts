import { drizzle } from 'drizzle-orm/neon-serverless'
import { env } from '~/env'
import * as schema from './schema'

/** Internal access to the database */
export const idb = drizzle(env.DATABASE_URL, { schema })
