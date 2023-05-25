import { template } from '@/utils'
import { STRONGEST_MODEL, one_shot } from '@/utils/ai'
import { sql } from '@vercel/postgres'
import { NextRequest, NextResponse } from 'next/server'

async function fetchSourceArticle(id: string) {
  return {
    url: `https://test.test.test/${id}`,
    text: 'Yearn Finance is a suite of products in Decentralized Finance (DeFi) that provides lending aggregation, yield generation, and insurance on the Ethereum blockchain. The protocol is maintained by various independent developers and is governed by YFI holders. It started out as a passion project by Andre Cronje to automate the process of switching capital between lending platforms in search of the best yield offered, as the lending yield is a floating rate rather than fixed rate. Funds are shifted between dYdX, AAVE, and Compound automatically as interest rates change between these protocols.  The service offered includes major USD tokens such as DAI, USDT, USDC, and TUSD. For example, if a user deposits DAI into yearn.finance, the user will receive yDAI token in return, which is a yield-bearing DAI token.  Later on, it collaborated with Curve Finance to release a yield-bearing USD tokens pool that includes four y-tokens: yDAI, yUSDT, yUSDC and yTUSD, it is named as yUSD.  Yearn Finance debuted the vault feature after its token launch, igniting a frenzy on automated yield farming and is considered the initiator of the category of yield farming aggregator. Basically, the vault will help users to claim yield farming rewards and sell it for the underlying assets.  Vaults benefit users by socializing gas costs, automating the yield generation and rebalancing process, and automatically shifting capital as opportunities arise. End users also do not need to have proficient knowledge of the underlying protocols involved or DeFi, thus the Vaults represent a passive-investing strategy. It is akin to a crypto hedge fund where the aim is to increase the amount of assets that users deposited.',
    published: (new Date()).toDateString()
  }
}

const personas = [
  'joyous kitten',
  'happy puppy',
  'salty pirate',
  'depressed robot'
]

function randomPersona(): string {
  const randomIndex = Math.floor(Math.random() * personas.length);
  return personas[randomIndex];
}

const prompt_template = template`
SYSTEM: you are an api that summarizes articles for a news feed
SYSTEM: your inputs are PERSONA, TAGS, SOURCE, CURRENT_DATE, PUBLISH_DATE, ARTICLE, FORMAT
SYSTEM: evaluate ARTICLE, output a very brief summary of 280 characters or less, a title, and a list of tags
SYSTEM: use FORMAT to format your ouput

PERSONA:
in your summary and title, use the voice of a ${'persona'}

SOURCE:
articles from this source are in plain text written by a human.

TAGS:
"hot" - apply this tag if the article was published within the last week
"yf" - apply this tag if the article mentions yield farming
"competition" - apply this tag if the article focuses on a competing protocol. eg Beefy

CURRENT_DATE:
${'current_date'}

PUBLISH_DATE:
${'publish_date'}

ARTICLE:
${'text'}

FORMAT:
format your output in this json format
{
  title
  summary
  tags[]
}
your response should only be in this format, then stop.
`

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { id } = body
  if(!id) throw '!id'

  const source = await fetchSourceArticle(id)

  const prompt = prompt_template({
    persona: randomPersona(),
    current_date: (new Date()).toDateString(),
    publish_date: source.published,
    text: source.text
  })

  const result = JSON.parse(await one_shot(prompt, STRONGEST_MODEL))

  await sql`
  INSERT INTO articles (url, title, summary, tags) 
  VALUES (${source.url}, ${result['title']}, ${result['summary']}, ${result['tags']})`

  return NextResponse.json({ status: 'ok' })
}
