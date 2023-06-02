import { NextRequest } from 'next/server'
import { randomPersona } from './personas'
import prompter from './prompter'
import { STRONGEST_MODEL, next_message } from '@/utils/ai'
import { Article, updateArticle } from '../data'

export interface Scraping {
  url: string,
  title: string,
  text: string,
  publish_date: string
}

export async function ensureArticleUrl(request: NextRequest) {
  const body = await request.json()
  const { articleUrl } = body
  if(!articleUrl) throw '!articleUrl'
  return articleUrl
}

export async function summarize(
  source: string,
  editors_notes: string,
  scraping: Scraping
) {
  const persona = randomPersona()

  const user_prompt = prompter.user_prompt({
    editors_notes,
    current_date: (new Date()).toDateString(),
    publish_date: scraping.publish_date,
    text: scraping.text
  })

  const result = JSON.parse(await next_message(
    [
      { role: 'system', content: prompter.system_prompt },
      { role: 'user', content: user_prompt }
    ], STRONGEST_MODEL
  ))

  if(process.env.NODE_ENV === 'development') console.log(result)

  await updateArticle({
    url: scraping.url,
    source,
    persona: persona.name,
    title: scraping.title,
    summary: result['summary'],
    tags: result['tags'],
    publish_date: scraping.publish_date,
    summarized: true
  } as Article)
}
