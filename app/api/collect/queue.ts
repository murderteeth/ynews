export default async function queue(endpointUrl: string, articleUrl: string) {
  if(!process.env.QSTASH) throw '!QSTASH'
  if(!process.env.QSTASH_TOKEN) throw '!QSTASH_TOKEN'

  console.log('queue', { endpointUrl, articleUrl })
  const result = await fetch(`${process.env.QSTASH}/${endpointUrl}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.QSTASH_TOKEN}`,
      'Content-type': 'application/json'
    },
    body: JSON.stringify({ articleUrl })
  })

  if(!result.ok) throw result.statusText
}
