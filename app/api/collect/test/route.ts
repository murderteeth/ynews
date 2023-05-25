import { db } from '@vercel/postgres'
import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'

export async function POST(request: NextRequest) {
  if(!process.env.QSTASH) throw '!QSTASH'
  if(!process.env.QSTASH_TOKEN) throw '!QSTASH_TOKEN'

  const origin = (new URL(request.url)).origin;
  const summarizer = `${origin}/api/summarize/test`

  // for test, generate random ids
  // normal use would be to poll a source for new articles 
  const ids = Array.from({ length: 2 }, () => nanoid())

  const client = await db.connect()
  for(const id of ids) {

    // for test, this check will always be false
    // normal use will vary depending on the source and polling frequency
    const url = `https://test.test.test/${id}`
    const { rows } = await client.sql`SELECT * FROM articles WHERE url = ${url}`
    if(rows.length) continue

    console.log('post summarizer task to qstash', id)
    const result = await fetch(`${process.env.QSTASH}/${summarizer}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.QSTASH_TOKEN}`,
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ id })
    })
    if(!result.ok) throw result.statusText
  }

  return NextResponse.json({ status: 'ok' })
}
