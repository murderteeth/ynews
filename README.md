```bash
yarn pullenv
yarn dev
```

```sql
CREATE TABLE articles (
  url VARCHAR(2048) NOT NULL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  summary TEXT NOT NULL,
  tags VARCHAR(32)[] NOT NULL,
  create_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

```bash
curl -XPOST \
    -H "Content-type: application/json" \
    -d '{}' \
    'http://localhost:3000/api/collect/test'

curl -XPOST \
    -H "Content-type: application/json" \
    -d '{ "id": "123" }' \
    'http://localhost:3000/api/summarize/test'

curl 'http://localhost:3000/api/feed'
```

```bash
```

Uses QStash for queueing
https://docs.upstash.com/qstash
