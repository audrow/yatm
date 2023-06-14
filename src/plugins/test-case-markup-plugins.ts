import * as constants from '../constants'
import testCaseToMd from '../test-cases/markup/test-case-to-md'
import loadConfig from '../test-cases/utils/load-config'
import type TestCase from '../test-cases/__types__/TestCase'
import TestCaseMarkupPlugins from './__types__/TestCaseMarkupPlugins'

const testCaseMarkupPlugins: TestCaseMarkupPlugins = {
  md: async (testCase: TestCase) => {
    const {translation_map} = loadConfig(constants.TEST_CASE_CONFIG)
    return testCaseToMd(testCase, translation_map)
  },
}

export default testCaseMarkupPlugins
