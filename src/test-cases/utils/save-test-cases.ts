import fs from 'fs'
import yaml from 'js-yaml'
import {join} from 'path'
import type TestCase from '../__types__/TestCase'

export default function saveTestCases(
  testCases: TestCase[],
  outputDirectory: string,
) {
  testCases.forEach((testCase) => {
    const fileName = getTestCaseSaveFileName(testCase)
    const filePath = join(outputDirectory, `${fileName}.yaml`)
    fs.writeFileSync(filePath, yaml.dump(testCase))
  })
}

export function getTestCaseSaveFileName(testCase: TestCase) {
  let fileName = testCase.name
  Object.values(testCase.dimensions).forEach((dimension) => {
    fileName += `-${dimension}`
  })
  fileName += `-g${testCase.generation}`
  fileName = fileName.replace(/\s/g, '-').toLowerCase()
  return fileName
}
