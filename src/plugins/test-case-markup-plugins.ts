import * as constants from '../constants'
import testCaseToMd from '../test-cases/markup/test-case-to-md'
import type TestCase from '../test-cases/__types__/TestCase'
import TestCaseMarkupPlugins from './__types__/TestCaseMarkupPlugins'

const testCaseMarkupPlugins: TestCaseMarkupPlugins = {
  md: async (testCase: TestCase) => {
    return testCaseToMd(testCase, constants.TRANSLATION_MAP)
  },
}

export default testCaseMarkupPlugins
