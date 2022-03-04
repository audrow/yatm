import testCaseToMd from '../test-case-renderer/test-case-to-md'
import type GithubIssue from '../__types__/GithubIssue'
import type TestCase from '../__types__/TestCase'

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
