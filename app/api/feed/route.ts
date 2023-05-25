import { sql } from '@vercel/postgres'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { rows } = await sql`
  SELECT url, title, summary, tags, create_date
  FROM articles 
  ORDER BY create_date 
  DESC LIMIT 100`

  return NextResponse.json(rows)
}

export const dynamic = 'forece-dynamic'
