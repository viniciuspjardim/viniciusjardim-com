import { idb, s } from './drizzle'

import * as category from './entities/category'
import * as post from './entities/post'

const db = {
  category,
  post,
}

export { db, idb, s }
