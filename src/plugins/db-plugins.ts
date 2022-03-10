import loadMatchingTestCases from '../test-cases/utils/load-matching-test-cases'
import printTestCases from '../test-cases/utils/print-test-cases'
import type TestCase from '../test-cases/__types__/TestCase'
import DbPlugins from './__types__/DbPlugins'

const dbPlugins: DbPlugins = {
  github: {
    create: async (regex) => {
      const testCases = loadMatchingTestCases(regex)
      console.log(printTestCases(testCases))
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
