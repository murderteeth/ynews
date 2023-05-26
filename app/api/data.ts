import { VercelPoolClient, db, sql } from "@vercel/postgres"

export interface Article {
  url: string,
  source: string,
  persona: string,
  title: string,
  summary: string,
  tags: string[],
  publish_date: string,
  approved: boolean
}

export async function articleExists(url: string, client?: VercelPoolClient) {
  if(!client) client = await db.connect()
  const { rows } = await client.sql`SELECT * FROM articles WHERE url = ${url}`
  return rows.length > 0
}

export async function insertArticle(article: Article) {
  await sql`
  INSERT INTO articles (url, source, persona, title, summary, tags, publish_date)
  VALUES (
    ${article.url}, 
    ${article.source}, 
    ${article.persona}, 
    ${article.title}, 
    ${article.summary}, 
    ${article.tags as any}, 
    ${article.publish_date}
  )`
}
