import { NextResponse } from 'next/server'
import { db } from '~/db'

export async function GET() {
  const categories = await db.category.getAll()

  return NextResponse.json(categories)
}



