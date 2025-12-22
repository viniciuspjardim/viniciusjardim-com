import { NextResponse } from 'next/server'
import { db } from '~/db'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const post = await db.post.getOneBySlug(slug)

  return NextResponse.json(post)
}
