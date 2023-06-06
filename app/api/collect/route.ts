import { NextRequest, NextResponse } from 'next/server'
import { db } from '@vercel/postgres'
import { upsertArticle } from '../data'

export interface Collector {
  collect(): Promise<string[]>
}

export async function queue(request: NextRequest, summarizer: string, articleUrls: string[]) {
  if(!process.env.QSTASH) throw '!QSTASH'
  if(!process.env.QSTASH_TOKEN) throw '!QSTASH_TOKEN'

  const endpointUrl = `${(new URL(request.url)).origin}/api/summarize`
  const client = await db.connect()
  for(const articleUrl of articleUrls) {
    const article = await upsertArticle(articleUrl, client)
    if(article.summarized || article.rejected) continue

    console.log('queue', { summarizer, articleUrl })

    const result = await fetch(`${process.env.QSTASH}/${endpointUrl}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.QSTASH_TOKEN}`,
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ summarizer, articleUrl })
    })

    if(!result.ok) throw result.statusText
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { collector } = body
  if(!collector) throw '!collector'
  const module = await import(`./collectors/${collector}`)
  const instance = new module.default() as Collector
  const articleUrls = await instance.collect()
  await queue(request, collector, articleUrls)
  return NextResponse.json({ status: 'queued' })
}
