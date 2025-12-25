import { NextResponse } from 'next/server'
import { db } from '~/db'

export async function GET() {
  const posts = await db.post.getAll()

  return NextResponse.json(posts)
}
