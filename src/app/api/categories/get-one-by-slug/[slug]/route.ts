import { NextResponse } from 'next/server'
import { db } from '~/db'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const category = await db.category.getOneBySlug(slug)

  return NextResponse.json(category)
}



