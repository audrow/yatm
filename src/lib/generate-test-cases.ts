import fs from 'fs'
import {join} from 'path'
import yaml from 'js-yaml'
import combinate from 'combinate'
import endent from 'endent'

import warnOnDuplicateRequirementNames from './warn-on-duplicate-requirement-names'

import type TestCaseDimensions from '../__types__/TestCaseDimensions'
import type Requirement from '../__types__/Requirement'
import type RequirementFilter from '../__types__/RequirementFilter'
import type TestCase from '../__types__/TestCase'

export default function generateTestCases({
  requirements,
  dimensions,
  generation,
  filters,
  outputDirectory,
  isDryRun = false,
}: {
  requirements: Requirement[]
  dimensions: TestCaseDimensions
  generation: number
  filters: RequirementFilter | RequirementFilter[]
  outputDirectory: string
  isDryRun?: boolean
}) {
  const outputRequirements = filterRequirements(requirements, filters)
  warnOnDuplicateRequirementNames(outputRequirements, true)

  const testCases = getTestCasesFromRequirements(
    outputRequirements,
    dimensions,
    generation,
  )
  if (isDryRun) {
    const message = printTestCases(testCases)
    console.log(message)
  } else {
    saveTestCases(testCases, outputDirectory)
  }
}

function filterRequirements(
  requirements: Requirement[],
  filters: RequirementFilter | RequirementFilter[],
) {
  if (!Array.isArray(filters)) {
    filters = [filters]
  }
  if (filters.length === 0) {
    return requirements
  }
  for (const filter of filters) {
    if (requirements.length === 0) {
      return []
    }
    if (!filter.name && !filter.labels) {
      console.error(
        'Requirement filter must have either a name or labels property',
      )
      process.exit(1)
    }
    if (filter.name) {
      requirements = requirements.filter((r) => {
        const titleRegex = new RegExp(filter.name!, filter.regexOptions)
        const match = r.name.match(titleRegex)
        return filter.isMatch ? match : !match
      })
    }
    if (filter.labels) {
      requirements = requirements.filter((r) => {
        const match = filter.labels!.every((label) => {
          const labelRegex = new RegExp(label, filter.regexOptions)
          return r.labels?.some((rLabel) => rLabel.match(labelRegex))
        })
        return filter.isMatch ? match : !match
      })
    }
  }
  return requirements
}

function getTestCasesFromRequirements(
  requirements: Requirement[],
  dimensions: TestCaseDimensions,
  generation: number,
) {
  const testCases: TestCase[] = []
  const dimensionCombinations = combinate(dimensions)
  dimensionCombinations.forEach((combo) => {
    requirements.forEach((requirement) => {
      testCases.push({
        generation,
        ...requirement,
        dimensions: combo,
      })
    })
  })
  return testCases
}

function printTestCases(testCases: TestCase[]) {
  let message = 'Test cases:'
  testCases.forEach((testCase, idx) => {
    message = endent`
        ${message}
        ${idx + 1}. ${testCase.name}
      `
    if (Object.keys(testCase.dimensions).length > 0) {
      message = endent`
          ${message}
            - dimensions:
                ${Object.entries(testCase.dimensions)
                  .map(([key, value]) => {
                    return `${key}: ${value}`
                  })
                  .join(',\n')}
        `
    }
    if (testCase.labels && testCase.labels.length > 0) {
      message = endent`
          ${message}
            - labels: ${testCase.labels.join(', ')}
        `
    }
  })
  return message
}

function saveTestCases(testCases: TestCase[], outputDirectory: string) {
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
