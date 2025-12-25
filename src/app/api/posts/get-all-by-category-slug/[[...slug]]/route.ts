import { NextResponse } from 'next/server'
import { db } from '~/db'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug?: string[] }> }
) {
  const { slug } = await params
  const categorySlug = slug?.[0]
  const posts = await db.post.getAllByCategorySlug(categorySlug)

  return NextResponse.json(posts)
}



