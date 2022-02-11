import TestCase from '../__types__/TestsCase'

interface TestCaseDb {
  create(testCase: TestCase): Promise<TestCase>
  read(id: string): Promise<TestCase>
  update(id: string, newTestCase: TestCase): Promise<void>
  delete(id: string): Promise<void>
}

export default TestCaseDb
