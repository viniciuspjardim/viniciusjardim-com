import { NextResponse } from 'next/server'
import { db } from '~/db'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const post = await db.post.getOneById(Number(id))

  return NextResponse.json(post)
}



