import { NextRequest, NextResponse } from 'next/server'
import { Scraping, ensureArticleUrl, summarize } from '../utils'

require('dotenv').config();
const { Octokit } = require('@octokit/rest');
const openai = require('openai');

const GITHUB_ACCESS_TOKEN = process.env.GITHUB_ACCESS_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const github = new Octokit({ auth: GITHUB_ACCESS_TOKEN });
openai.apiKey = OPENAI_API_KEY;

const orgName = 'yearn';

async function scrapeArticle(url: string) : Promise<Scraping> {
  // for test, some nice static marketing copy
  // normally you would fetch and prep text from the url

  // get org and repo from url, atm url is like: https://github.com/octocat/Hello-World/pull/1347
  const repo = await github.repos.get({ owner: orgName, repo: name });

  const prs = await github.paginate(github.pulls.list, { owner: orgName, repo: repo.name, state: 'open' });

  return {
    url,
    title: 'Yearn Finance: The Ultimate Yield',
    text: 'Yearn Finance is a suite of products in Decentralized Finance (DeFi) that provides lending aggregation, yield generation, and insurance on the Ethereum blockchain. The protocol is maintained by various independent developers and is governed by YFI holders. It started out as a passion project by Andre Cronje to automate the process of switching capital between lending platforms in search of the best yield offered, as the lending yield is a floating rate rather than fixed rate. Funds are shifted between dYdX, AAVE, and Compound automatically as interest rates change between these protocols.  The service offered includes major USD tokens such as DAI, USDT, USDC, and TUSD. For example, if a user deposits DAI into yearn.finance, the user will receive yDAI token in return, which is a yield-bearing DAI token.  Later on, it collaborated with Curve Finance to release a yield-bearing USD tokens pool that includes four y-tokens: yDAI, yUSDT, yUSDC and yTUSD, it is named as yUSD.  Yearn Finance debuted the vault feature after its token launch, igniting a frenzy on automated yield farming and is considered the initiator of the category of yield farming aggregator. Basically, the vault will help users to claim yield farming rewards and sell it for the underlying assets.  Vaults benefit users by socializing gas costs, automating the yield generation and rebalancing process, and automatically shifting capital as opportunities arise. End users also do not need to have proficient knowledge of the underlying protocols involved or DeFi, thus the Vaults represent a passive-investing strategy. It is akin to a crypto hedge fund where the aim is to increase the amount of assets that users deposited.',
    publish_date: (new Date()).toDateString()
  }
}

export async function POST(request: NextRequest) {
  const articleUrl = await ensureArticleUrl(request)

  const source = 'test'
  const scraping = await scrapeArticle(articleUrl)
  const editors_notes = 'these articles contain a lot of marketing material. dumb it down please!'

  // TODO: if(await rejectIfIrrelevant(scraping)) {
  //   return NextResponse.json({ status: 'rejected' })
  // }
  await summarize(source, editors_notes, scraping)
  return NextResponse.json({ status: 'summarized' })
}
