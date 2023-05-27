import { NextRequest } from 'next/server'
import { db } from '@vercel/postgres'
import { upsertArticle } from '../data'

export function summarizerUrl(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const source = requestUrl.pathname.replace('/api/collect/', '')
  return `${requestUrl.origin}/api/summarize/${source}`
}

export async function queue(request: NextRequest, articleUrls: string[]) {
  if(!process.env.QSTASH) throw '!QSTASH'
  if(!process.env.QSTASH_TOKEN) throw '!QSTASH_TOKEN'

  const endpointUrl = summarizerUrl(request)
  const client = await db.connect()
  for(const articleUrl of articleUrls) {
    const article = await upsertArticle(articleUrl, client)
    if(article.summarized || article.rejected) continue

    console.log('queue', { endpointUrl, articleUrl })

    const result = await fetch(`${process.env.QSTASH}/${endpointUrl}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.QSTASH_TOKEN}`,
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ articleUrl })
    })

    if(!result.ok) throw result.statusText
  }
}
