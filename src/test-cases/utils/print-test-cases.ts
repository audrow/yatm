import endent from 'endent'
import type TestCase from '../__types__/TestCase'

export default function printTestCases(testCases: TestCase[]) {
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
