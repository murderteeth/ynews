import { NextRequest, NextResponse } from 'next/server'
import { Article, upsertArticle } from '../data'

export async function POST(request: NextRequest) {
  const article = await request.json() as Article
  if(!article) throw new NextResponse(null, { status: 400 })
  await upsertArticle(article)
  return NextResponse.json({ status: 'ok' })
}
