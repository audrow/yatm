import {REPOSITORY} from '../constants.github'
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
  },
}

export default dbPlugins
