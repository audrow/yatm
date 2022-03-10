import {REPOSITORY} from '../constants.github'
import {createIssues} from '../test-cases/db/github/gh-issues'
import testCaseToGithubIssue from '../test-cases/db/github/test-case-to-gh-issue'
import loadMatchingTestCases from '../test-cases/utils/load-matching-test-cases'
import type TestCase from '../test-cases/__types__/TestCase'
import DbPlugins from './__types__/DbPlugins'

const dbPlugins: DbPlugins = {
  github: {
    create: async (regex) => {
      const testCases = loadMatchingTestCases(regex)
      const issues = testCases.map(testCaseToGithubIssue)
      await createIssues(REPOSITORY, issues)
    },
    read: async (regex: string) => {
      console.log(`Reading test cases that match '${regex}'`)
    },
    update: async (testCase: TestCase) => {
      console.log(`Updating test case ${testCase.name}`)
    },
    delete: async (regex: string) => {
      console.log(`Deleting test case that match '${regex}'`)
    },
  },
}

export default dbPlugins
