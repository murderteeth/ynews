# yNews

This project is build with Next.js, Vercel, and QStash. QStash is used for http queueing, [https://docs.upstash.com/qstash](https://docs.upstash.com/qstash).


## Getting started
To run this project locally you either need to be a memeber of the yNews vercel team or you can create your own vercel project and link to that. If you create your own vercel project, use the vercel dashboard to add a postgres database and add the following environment variables to all your deployments:
```bash
OPENAI_API_KEY=
QSTASH=
QSTASH_TOKEN=
```
Note, QStash vars are only needed if you want to automate the collectors in preview and production deployments.

Setup your local environment:
```bash
yarn add vercel -g
vercel link
yarn
yarn pullenv
yarn dev
```

Initialize the database:
```sql
CREATE TABLE articles (
  url VARCHAR(2048) NOT NULL PRIMARY KEY,
  source VARCHAR(32) NOT NULL,
  persona VARCHAR(32) NOT NULL,
  title VARCHAR(256) NOT NULL,
  summary TEXT NOT NULL,
  tags VARCHAR(32)[] NOT NULL,
  publish_date DATE NOT NULL,
  approved BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modified_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

Endpoint testing:
```bash
curl -XPOST \
    -H "Content-type: application/json" \
    -d '{}' \
    'http://localhost:3000/api/collect/test'

curl -XPOST \
    -H "Content-type: application/json" \
    -d '{ "articleUrl": "https://test.test.test/123" }' \
    'http://localhost:3000/api/summarize/test'

curl 'http://localhost:3000/api/feed'
```

## Add a new article pipline
1. Add a new collector endpoint at `app/api/collect/[source name]/route.ts`
2. Add a new summarizer endpoint at `app/api/summarizer/[source name]/route.ts`
3. Schedule QStash to call collector endpoint

See the test collector and summarizer endpoints for reference.
