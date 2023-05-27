import { VercelPoolClient, db, sql } from "@vercel/postgres"

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

export async function upsertArticle(url: string, client?: VercelPoolClient): Promise<Article> {
  if(!client) client = await db.connect()
  const result = await client.sql`
    INSERT INTO articles (url)
    VALUES (${url})
    ON CONFLICT (url) DO UPDATE
    SET url = EXCLUDED.url
    RETURNING *;`
  return result.rows[0] as Article
}

export async function updateArticle(article: Article, client?: VercelPoolClient): Promise<void> {
  if(!client) client = await db.connect()
  await client.sql`
    UPDATE articles
    SET source = ${article.source},
      persona = ${article.persona},
      title = ${article.title},
      summary = ${article.summary},
      tags = ${article.tags as any},
      publish_date = ${article.publish_date},
      summarized = ${article.summarized || false},
      rejected = ${article.rejected || false},
      approved = ${article.approved || false},
      modified_at = CURRENT_TIMESTAMP
    WHERE url = ${article.url};
  `;
}
