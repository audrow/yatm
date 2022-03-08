import type GithubIssue from '../../db/github/__types__/GithubIssue'
import testCaseToMd from '../../test-cases/markup/test-case-to-md'
import type TestCase from '../../test-cases/__types__/TestCase'

export default function testCaseToGithubIssue(testCase: TestCase) {
  const labels: string[] = []
  if (testCase.labels) {
    labels.push(...testCase.labels)
  }
  labels.push(...Object.values(testCase.dimensions))
  labels.push(`generation-${testCase.generation}`)

  const outIssue: GithubIssue = {
    title: testCase.name,
    body: testCaseToMd(testCase),
    labels,
  }
  return outIssue
}
