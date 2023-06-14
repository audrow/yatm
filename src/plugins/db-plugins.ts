import {REPOSITORY} from '../constants'
import {
  closeIssue,
  createIssues,
  getIssues,
} from '../test-cases/db/github/gh-issues'
import testCaseToGithubIssue from '../test-cases/db/github/test-case-to-gh-issue'
import loadMatchingTestCases from '../test-cases/utils/load-matching-test-cases'
import DbPlugins from './__types__/DbPlugins'

const dbPlugins: DbPlugins = {
  github: {
    create: async (regex) => {
      const testCases = loadMatchingTestCases(regex)
      const issues = testCases.map(testCaseToGithubIssue)
      await createIssues(REPOSITORY, issues)
    },
    delete: async (regex: string) => {
      const issues = (await getIssues(REPOSITORY, 'open')).filter((issue) => {
        const nameMatch = issue.title.match(regex)
        const labelMatch = issue.labels.some((label) => {
          if (typeof label === 'string') {
            return label.match(regex)
          } else if (typeof label.name === 'string') {
            return label.name.match(regex)
          } else {
            return false
          }
        })
        return nameMatch || labelMatch
      })
      issues.forEach(
        async (issue) => await closeIssue(REPOSITORY, issue.number),
      )
    },
    deleteNonUnique: async () => {
      const issues = await getIssues(REPOSITORY, 'open')
      let idx = 0
      while (idx < issues.length) {
        await closeDuplicates(issues, issues[idx].number)
        idx++
      }
    },
    hasDuplicates: async (id: number) => {
      const issues = await getIssues(REPOSITORY, 'open')
      await closeDuplicates(issues, id)
    },
    count: async () => {
      const issues = await getIssues(REPOSITORY, 'open')
      console.log('Issues: ', issues.length)
    },
  },
}

type GithubIssue = Exclude<
  Awaited<ReturnType<typeof getIssues>>[0],
  null | undefined
>

async function closeDuplicates(issues: GithubIssue[], id: number) {
  const issue = issues.find((issue) => issue.number === id)
  if (!issue) {
    console.error(`Issue ${id} not found`)
    return
  }
  const issueLabelsString = JSON.stringify(issue.labels)
  const copies = issues
    .filter((i) => i.title === issue.title)
    .filter((i) => JSON.stringify(i.labels) === issueLabelsString)
    .sort((a, b) => a.number - b.number)
  if (copies.length > 1) {
    console.log(`Duplicates found for issue ${id}`)
    const issueToKeep = copies.pop()
    const duplicateIds = copies.map((i) => i.number)
    duplicateIds.forEach(async (id) => {
      await closeIssue(REPOSITORY, id)
    })
    issues = issues.filter((i) => !(i.number in copies))
    console.log(`Keeping issue ${issueToKeep!.number}`)
  }
}

export default dbPlugins
