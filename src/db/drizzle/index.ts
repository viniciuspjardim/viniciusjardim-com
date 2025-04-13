import { drizzle } from 'drizzle-orm/neon-serverless'
import { env } from '~/env'
import * as s from './schema'

/** Internal access to the database */
const idb = drizzle(env.DATABASE_URL, { schema: s })

export { idb, s }
