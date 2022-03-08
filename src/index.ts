import fs from 'fs'
import yaml from 'js-yaml'
import {join} from 'path'
import * as constants from './constants'
import {createIssue} from './db/github/gh-issue-crud'
import type Repo from './db/github/__types__/Repo'
import setupOutputDir from './plugins/setup-output-dir'
import copyYaml from './requirements/generator/copy-yaml'
import ros2doc from './requirements/generator/ros2-docs'
import type Requirement from './requirements/__types__/Requirement'
import type Requirements from './requirements/__types__/Requirements'
import testCaseToGithubIssue from './test-cases/db/test-case-to-gh-issue'
import generateTestCases, {
  getTestCaseSaveFileName,
} from './test-cases/generator/generate-test-cases'
import warnOnDuplicateRequirementNames from './test-cases/generator/warn-on-duplicate-requirement-names'
import testCaseToMd from './test-cases/markup/test-case-to-md'
import type TestCase from './test-cases/__types__/TestCase'

function loadRequirements(directoryPath: string) {
  const requirements: Requirement[] = []
  const files = fs.readdirSync(directoryPath)
  if (files.length === 0) {
    throw new Error(`No files found in ${directoryPath}`)
  }
  files.forEach((file) => {
    requirements.push(
      ...(
        yaml.load(
          fs.readFileSync(join(directoryPath, file), 'utf8'),
        ) as Requirements
      ).requirements,
    )
  })

  return requirements.sort((a, b) => {
    return a.name.localeCompare(b.name)
  })
}

function loadTestCases(directoryPath: string) {
  const testCases: TestCase[] = []
  const files = fs.readdirSync(directoryPath)
  if (files.length === 0) {
    throw new Error(`No files found in ${directoryPath}`)
  }
  files.forEach((file) => {
    testCases.push(
      yaml.load(fs.readFileSync(join(directoryPath, file), 'utf8')) as TestCase,
    )
  })

  return testCases.sort((a, b) => {
    return a.name.localeCompare(b.name)
  })
}

async function main() {
  setupOutputDir()
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
    outputDirectory: constants.outputTestCasePath,
    // isDryRun: true,
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
