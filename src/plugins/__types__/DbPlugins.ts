import type TestCase from '../../test-cases/__types__/TestCase'

type DbPlugins = {
  [name: string]: {
    create: (regex: string) => Promise<void>
    read?: (regex: string) => Promise<void>
    update?: (testCase: TestCase) => Promise<void>
    delete: (regex: string) => Promise<void>
  }
}

export default DbPlugins
