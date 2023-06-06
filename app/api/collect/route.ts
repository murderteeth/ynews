import { NextRequest, NextResponse } from 'next/server'
import { db } from '@vercel/postgres'
import { upsertArticle } from '../data'

export interface Collector {
  collect(): Promise<string[]>
}

async function queue(request: NextRequest, source: string, articleUrls: string[]) {
  if(!process.env.QSTASH) throw '!QSTASH'
  if(!process.env.QSTASH_TOKEN) throw '!QSTASH_TOKEN'

  const endpointUrl = `${(new URL(request.url)).origin}/api/summarize`
  const client = await db.connect()
  for(const articleUrl of articleUrls) {
    const article = await upsertArticle(articleUrl, client)
    if(article.summarized || article.rejected) continue

    console.log('queue', { source, articleUrl })

    const result = await fetch(`${process.env.QSTASH}/${endpointUrl}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.QSTASH_TOKEN}`,
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ source, articleUrl })
    })

    if(!result.ok) throw result.statusText
  }
}

export async function POST(request: NextRequest) {
  const { source } = await request.json()
  if(!source) throw '!source'

  const _module = await import(`./collectors/${source}`)
  const instance = _module.default as Collector
  const articleUrls = await instance.collect()
  await queue(request, source, articleUrls)

  return NextResponse.json({ status: 'queued' })
}
