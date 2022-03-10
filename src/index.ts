import fs from 'fs'
import {join} from 'path'
import setupOutputDirectory from './cli/utils/setup-output-directory'
import * as constants from './constants'
import {createIssue} from './db/github/gh-issue-crud'
import type Repo from './db/github/__types__/Repo'
import copyYaml from './requirements/generator/copy-yaml'
import ros2doc from './requirements/generator/ros2-docs'
import loadRequirements from './requirements/utils/load-requirements'
import testCaseToGithubIssue from './test-cases/db/test-case-to-gh-issue'
import generateTestCases from './test-cases/generator/generate-test-cases'
import warnOnDuplicateRequirementNames from './test-cases/generator/warn-on-duplicate-requirement-names'
import testCaseToMd from './test-cases/markup/test-case-to-md'
import loadTestCases from './test-cases/utils/load-test-cases'
import {getTestCaseSaveFileName} from './test-cases/utils/save-test-cases'
import type TestCase from './test-cases/__types__/TestCase'

async function main() {
  setupOutputDirectory()
  copyYaml(constants.inputRequirementsPath, constants.outputRequirementsPath)
  await ros2doc(constants.outputRequirementsPath)

  const requirements = loadRequirements(constants.outputRequirementsPath)
  warnOnDuplicateRequirementNames(requirements, false)

  const filters = [
    {
      labels: ['^launch$'],
      isMatch: false,
    },
    {
      name: 'tutorial',
      regexOptions: 'i',
      isMatch: true,
    },
  ]
  const dimensions = {
    dds: ['fastdds', 'connext'],
    installType: ['binary'],
    platform: ['jammy'],
  }
  const generation = 1
  const repo: Repo = {
    owner: 'audrow',
    name: 'humble-tcm-example',
  }

  generateTestCases({
    requirements,
    dimensions,
    generation,
    filters,
  })

  let testCases: TestCase[] = []
  try {
    testCases = loadTestCases(constants.outputTestCasePath)
    testCases.forEach((testCase) => {
      console.log(testCase.name)
    })
  } catch (error) {
    console.error(error)
  }
  testCases.forEach((testCase) => {
    const md = testCaseToMd(testCase)
    const filePath = join(
      constants.outputTestCaseRenderPath,
      `${getTestCaseSaveFileName(testCase)}.md`,
    )
    fs.writeFileSync(filePath, md)
  })
  testCases.forEach(async (testCase) => {
    const issue = testCaseToGithubIssue(testCase)
    try {
      await createIssue(repo, issue)
    } catch (error) {
      console.error(error)
    }
  })
}

if (typeof require !== 'undefined' && require.main === module) {
  main()
}
