# yNews
Breaking news by ai generated defi animals.

- nice we used all the words
- collects articles and events from various sources
- summarizes what it finds using GPT

![image](https://github.com/murderteeth/ynews/assets/89237203/872a8cd1-707a-4520-9cbd-b55e1fcfdeb8)

This project uses Next.js, Vercel, OpenAI, and QStash. QStash is used for http queueing, [https://docs.upstash.com/qstash](https://docs.upstash.com/qstash).


## Getting started
To run this project locally you either need to be a memeber of the yNews vercel team or you can create your own vercel project and link to that. If you create your own vercel project, use the vercel dashboard to add a postgres database and add the following environment variables to all your deployments:
```bash
OPENAI_API_KEY=
QSTASH=
QSTASH_TOKEN=
```
Note, QStash vars are only needed if you want to automate the collectors in preview and production deployments.

Setup your local environment
```bash
yarn add vercel -g
vercel link
yarn
yarn pullenv
yarn dev
```

Initialize the database
```sql
CREATE TABLE articles (
  url VARCHAR(2048) NOT NULL PRIMARY KEY,
  source VARCHAR(32),
  persona VARCHAR(32),
  title VARCHAR(256),
  summary TEXT,
  tags VARCHAR(32)[],
  publish_date DATE,
  summarized BOOLEAN NOT NULL DEFAULT FALSE,
  rejected BOOLEAN NOT NULL DEFAULT FALSE,
  approved BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modified_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

Jest testing
```bash
yarn test
```

Endpoint testing
```bash
curl -v \
  -H "Content-type: application/json" \
  -H "key: ********" \
  -d '{ "source": "test" }' \
  'http://localhost:3000/api/collect'

curl -v \
  -H "Content-type: application/json" \
  -H "key: ********" \
  -d '{
        "source": "test",
        "articleUrl": "https://test.test.test/123"
      }' \
  'http://localhost:3000/api/summarize'

curl -v 'http://localhost:3000/api/feed'
```

## Add new article source
1. Implement a collector at this path `app/api/collect/collectors/[source name].ts`
2. Implelment a summarizer at this path `app/api/summarizer/summarizers/[source name].ts`
3. Schedule QStash to post the collector endpoint with this body:
```json
{
  "source": "[source name]"
}
```

See the test collector and summarizer for reference.

## Schedule a QStash collector job
```bash
curl -v \
  -H "Authorization: Bearer ********" \
  -H "Upstash-Forward-key: ********" \
  -H "Upstash-Cron: */30 * * * *" \
  -H "Content-type: application/json" \
  -d '{ "source": "test" }' \
  'https://qstash.upstash.io/v1/publish/https://ynews-greatsword.vercel.app/api/collect'
```

## Mannually post an article summary
```bash
curl -v \
  -H "key: ********" \
  -H "Content-type: application/json" \
  -d '{ 
        "url": "https://test.test.test/123",
        "source": "test",
        "title": "Yearn Finance: The Ultimate Yield",
        "summary": "Yearn Finance helps peeps find the best yields in DeFi, automates yield farming, makes it easy for anyone!",
        "tags": ["hot", "defi"],
        "publish_date": "2023-05-27T00:00:00.000Z",
        "summarized": "true",
        "approved": "true"
      }' \
  'http://localhost:3000/api/article'
```
