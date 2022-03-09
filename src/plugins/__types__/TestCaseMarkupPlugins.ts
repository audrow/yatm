import type TestCase from '../../test-cases/__types__/TestCase'

type TestCaseMarkupPlugins = {
  [name: string]: (testCase: TestCase) => Promise<string>
}

export default TestCaseMarkupPlugins
