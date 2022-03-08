import fs from 'fs'
import yaml from 'js-yaml'
import {join} from 'path'
import type TestCase from '../__types__/TestCase'

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

export default loadTestCases
