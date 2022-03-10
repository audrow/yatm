import {Octokit} from 'octokit'
import {sleep} from 'sleep'
import {GITHUB_API_TOKEN, RETRY_SECONDS} from '../../../constants.github'
import type GithubIssue from './__types__/GithubIssue'
import type IssueState from './__types__/IssueState'
import type Repo from './__types__/Repo'
import type Status from './__types__/Status'

const gh = new Octokit({
  auth: GITHUB_API_TOKEN,
}).rest

export async function isIssueAlreadyOpen(
  repo: Repo,
  issue: GithubIssue,
): Promise<boolean> {
  const issues = await getIssueByTitleAndLabels(
    repo,
    issue.title,
    issue.labels,
    'open',
  )
  return issues.length > 0
}

export async function getIssueByTitleAndLabels(
  repo: Repo,
  title: string,
  labels: string[],
  state: IssueState,
) {
  const issues = (await getIssues(repo, state)).filter((issue) => {
    const matchTitle = issue.title === title
    const issueLabels = issue.labels
      .filter((label) => typeof label === 'string' || !!label.name)
      .map((label) => {
        if (typeof label === 'string') {
          return label
        } else {
          return label.name as string
        }
      })
    const matchLabels = labels.every((label) => issueLabels.includes(label))
    return matchTitle && matchLabels
  })
  return issues
}

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
  let status: Status
  do {
    status = await createIssuesHelper(repo, issues)
    if (status === 'failure') {
      console.log(`Retrying in ${RETRY_SECONDS.toLocaleString()} seconds...`)
      sleep(RETRY_SECONDS)
    }
  } while (status === 'failure')
}

async function createIssuesHelper(
  repo: Repo,
  issues: GithubIssue[],
): Promise<Status> {
  for (const issue of issues) {
    try {
      const issueString = `${issue.title} - with labels: ${issue.labels.join(
        ', ',
      )}`
      if (await isIssueAlreadyOpen(repo, issue)) {
        console.info(`Issue already exists: ${issueString}`)
      } else {
        await createIssue(repo, issue)
        console.info(`Created issue: ${issueString}`)
      }
    } catch (error) {
      console.error(error)
      return 'failure'
    }
  }
  return 'success'
}

async function createIssue(repo: Repo, issue: GithubIssue) {
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
