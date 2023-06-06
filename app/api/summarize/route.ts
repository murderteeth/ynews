import { NextRequest, NextResponse } from 'next/server'
import { randomPersona } from './personas'
import prompter from './prompter'
import { STRONGEST_MODEL, next_message } from '@/utils/ai'
import { Article, updateArticle } from '../data'

export interface Scrap {
  url: string,
  title: string,
  text: string,
  publish_date: string
}

export interface Summarizer {
  editors_notes: string,
  scrape(url: string): Promise<Scrap>
}

export async function summarize(
  source: string,
  summarizer: Summarizer,
  articleUrl: string
) {
  const scrap = await summarizer.scrape(articleUrl)
  const persona = randomPersona()

  const user_prompt = prompter.user_prompt({
    editors_notes: summarizer.editors_notes,
    persona: persona.description,
    current_date: (new Date()).toDateString(),
    publish_date: scrap.publish_date,
    text: scrap.text
  })

  const result = JSON.parse(await next_message(
    [
      { role: 'system', content: prompter.system_prompt },
      { role: 'user', content: user_prompt }
    ], STRONGEST_MODEL
  ))

  if(process.env.NODE_ENV === 'development') console.log(result)

  return {
    url: articleUrl,
    source,
    persona: persona.name,
    title: scrap.title,
    summary: result['summary'],
    tags: result['tags'],
    publish_date: scrap.publish_date,
    summarized: true
  } as Article
}

export async function POST(request: NextRequest) {
  const { source, articleUrl } = await request.json()
  if(!source) throw '!source'
  if(!articleUrl) throw '!articleUrl'

  const module = await import(`./summarizers/${source}`)
  const instance = module.default as Summarizer
  const article = await summarize(source, instance, articleUrl)
  await updateArticle(article)

  return NextResponse.json({ status: 'summarized' })
}
