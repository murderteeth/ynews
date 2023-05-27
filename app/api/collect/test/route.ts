import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { queue } from '../utils'

export async function POST(request: NextRequest) {

  // for test, generate test urls with random ids
  // normally you would poll a source for new articles
  const ids = Array.from({ length: 2 }, () => nanoid())
  const articleUrls = ids.map(id => `https://test.test.test/${id}`)

  await queue(request, articleUrls)
  return NextResponse.json({ status: 'queued' })
}
