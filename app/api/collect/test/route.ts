import { db } from '@vercel/postgres'
import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { articleExists } from '../../data'
import queue from '../queue';

export async function POST(request: NextRequest) {
  const origin = (new URL(request.url)).origin;
  const summarizer = `${origin}/api/summarize/test`

  // for test, generate test urls with random ids
  // normally you would poll a source for new articles
  const ids = Array.from({ length: 2 }, () => nanoid())
  const articleUrls = ids.map(id => `https://test.test.test/${id}`)

  const client = await db.connect()
  for(const articleUrl of articleUrls) {

    // for test, this check will always be false
    // normally this check varies depending on the source and polling frequency
    if(await articleExists(articleUrl, client)) continue

    await queue(summarizer, articleUrl)
  }

  return NextResponse.json({ status: 'ok' })
}
