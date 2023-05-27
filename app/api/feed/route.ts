import { sql } from '@vercel/postgres'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { rows } = await sql`
  SELECT url, source, persona, title, summary, tags, publish_date
  FROM articles
  WHERE summarized = true
  ORDER BY modified_at DESC
  LIMIT 100`

  return NextResponse.json(rows)
}

export const dynamic = 'force-dynamic'
