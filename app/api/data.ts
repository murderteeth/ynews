import { VercelPoolClient, db } from '@vercel/postgres'

export interface Article {
  url: string,
  source: string,
  persona: string,
  title: string,
  summary: string,
  tags: string[],
  publish_date: string,
  approved: boolean,
  summarized: boolean,
  rejected: boolean
}

export async function upsertArticle(article: Article, client?: VercelPoolClient): Promise<Article> {
  if(!client) client = await db.connect()
  const result = await client.sql`
    INSERT INTO articles (
      url, 
      source, 
      persona, 
      title, 
      summary, 
      tags, 
      publish_date, 
      approved, 
      summarized, 
      rejected, 
      modified_at
    ) VALUES (
      ${article.url}, 
      ${article.source}, 
      ${article.persona}, 
      ${article.title}, 
      ${article.summary}, 
      ${article.tags as any}, 
      ${article.publish_date}, 
      ${article.approved || false}, 
      ${article.summarized || false}, 
      ${article.rejected || false}, 
      CURRENT_TIMESTAMP
    )
    ON CONFLICT (url) DO UPDATE
    SET url = EXCLUDED.url,
        source = EXCLUDED.source,
        persona = EXCLUDED.persona,
        title = EXCLUDED.title,
        summary = EXCLUDED.summary,
        tags = EXCLUDED.tags,
        publish_date = EXCLUDED.publish_date,
        approved = EXCLUDED.approved,
        summarized = EXCLUDED.summarized,
        rejected = EXCLUDED.rejected,
        modified_at = CURRENT_TIMESTAMP
    RETURNING *;`
  return result.rows[0] as Article
}
