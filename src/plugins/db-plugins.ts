import {REPOSITORY} from '../constants.github'
import {
  closeIssueByTitleAndLabels,
  createIssues,
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
      const issues = loadMatchingTestCases(regex).map(testCaseToGithubIssue)
      issues.forEach(
        async (issue) =>
          await closeIssueByTitleAndLabels(
            REPOSITORY,
            issue.title,
            issue.labels,
          ),
      )
    },
  },
}

export default dbPlugins
