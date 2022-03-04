import {Octokit} from 'octokit'
import {GITHUB_API_TOKEN} from '../lib/constants'
import type GithubIssue from '../__types__/GithubIssue'
import type IssueState from '../__types__/IssueState'
import type Repo from '../__types__/Repo'

const gh = new Octokit({
  auth: GITHUB_API_TOKEN,
}).rest

export async function getIssues(repo: Repo, state: IssueState) {
  const issuesAndPrs = (
    await gh.issues.listForRepo({
      owner: repo.owner,
      repo: repo.name,
      state,
    })
  ).data
  return issuesAndPrs.filter((i) => !i.pull_request)
}

export async function createIssues(repo: Repo, issues: GithubIssue[]) {
  for (const issue of issues) {
    await createIssue(repo, issue)
  }
}

export async function createIssue(repo: Repo, issue: GithubIssue) {
  return await gh.issues.create({
    owner: repo.owner,
    repo: repo.name,
    title: issue.title,
    body: issue.body,
    labels: issue.labels,
  })
}

export async function closeGeneratedIssues(repo: Repo, generatedStamp: string) {
  ;(await getIssues(repo, 'open'))
    .filter((i) => i.body?.includes(generatedStamp))
    .map(async (i) => closeIssue(repo, i.number))
}

export async function closeIssue(repo: Repo, issueNumber: number) {
  await gh.issues.update({
    owner: repo.owner,
    repo: repo.name,
    issue_number: issueNumber,
    state: 'closed',
  })
}

export async function getUser() {
  const {
    data: {login},
  } = await gh.users.getAuthenticated()
  return login
}
