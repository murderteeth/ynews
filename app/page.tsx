'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import TimeAgo from 'react-timeago'
import { Article } from './api/data'

function useFeedUrl() {
  const [url, setUrl] = useState('')
  useEffect(() => {
    if(typeof window === 'undefined') return
    const { protocol, host } = window.location
    setUrl(`${protocol}//${host}/api/feed`)
  }, [setUrl])
  return url
}

function useFeed() {
  const url = useFeedUrl()
  const [articles, setArticles] = useState<Article[]>([])

  const refresh = useCallback(async () => {
    const res = await fetch('/api/feed')
    const data = await res.json()
    setArticles(data)
  }, [])

  useEffect(() => { refresh() }, [refresh])

  return { url, articles, refresh }
}

export default function Home() {
  const { url, articles, refresh } = useFeed()
  return <main className={'flex items-center justify-center'}>
    <div className={`w-full sm:w-1/2 min-h-screen pt-16
      flex flex-col items-start gap-8`}>
      <h1 className={'w-full px-4 py-6 font-bold text-4xl bg-purple-950'}>yNews API</h1>
      <div onClick={refresh} className={'w-full px-4 py-6 whitespace-pre text-purple-200 bg-purple-950'}>
        {`curl ${url}`}
      </div>
      <div className={'h-1/2 flex flex-col gap-4'}>
        {articles && articles.map((article, i) => 
          <article key={i} className={'p-8 flex flex-col gap-2 border border-purple-400'}>
            <h2 className={'text-xl'}>
              <a href={article.url} target={'_blank'} rel={'noreferrer'}>{article.url}</a>
            </h2>
            <div className={'flex items-center gap-4'}>
              <TimeAgo date={article.publish_date} />
              <div>
                {article.tags.map((tag, i) => 
                  <span key={i} className={'px-2 py-1 mr-2 text-sm text-purple-100 bg-purple-800'}>
                    {tag}
                  </span>
                )}
              </div>
            </div>
            <p>{article.title} {article.summary}</p>
          </article>
        )}
      </div>
    </div>
  </main>
}
