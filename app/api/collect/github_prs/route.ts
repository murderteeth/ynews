import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { queue } from '../utils'

require('dotenv').config();
const { Octokit } = require('@octokit/rest');
const openai = require('openai');

const GITHUB_ACCESS_TOKEN = process.env.GITHUB_ACCESS_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const github = new Octokit({ auth: GITHUB_ACCESS_TOKEN });
openai.apiKey = OPENAI_API_KEY;

export async function POST(request: NextRequest) {

  const orgName = 'yearn';

  console.log(`Scanning ${orgName}...`);

  const repos = await github.paginate(github.repos.listForOrg, { org: orgName });

  for (const repo of repos) {
    try {
      const prs = await github.paginate(github.pulls.list, { owner: orgName, repo: repo.name, state: 'open' });
      for (const pr of prs) {
        await queue(request, pr.html_url)

      }
    } catch (error) {
      console.log(`Error fetching PRs for repo ${repo.name}: ${error}`);
      continue;
    }
  }

  return NextResponse.json({ status: 'queued' })
}
