import TestCase from '../__types__/TestsCase'

interface TestCaseDb {
  create(testCase: TestCase): Promise<string>
  read?(id: string): Promise<unknown>
  update(id: string, testCase: TestCase): Promise<void>
  delete(id: string): Promise<void>
}

export default TestCaseDb
