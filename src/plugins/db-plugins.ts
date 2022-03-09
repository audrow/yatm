import type TestCase from '../test-cases/__types__/TestCase'
import DbPlugins from './__types__/DbPlugins'

const dbPlugins: DbPlugins = {
  github: {
    create: async (regex) => {
      console.log(`Creating test cases matching '${regex}'`)
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
