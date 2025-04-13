import { idb } from './drizzle'
import * as s from './schema'

import * as category from './category'
import * as post from './post'

const db = {
  category,
  post,
}

export { db, idb, s }
