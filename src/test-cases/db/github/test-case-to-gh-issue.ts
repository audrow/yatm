import {DISTRO} from '../../../constants'
import testCaseToMd from '../../markup/test-case-to-md'
import type TestCase from '../../__types__/TestCase'
import type GithubIssue from './__types__/GithubIssue'

export default function testCaseToGithubIssue(testCase: TestCase) {
  const labels: string[] = []
  if (testCase.labels) {
    labels.push(...testCase.labels)
  }
  labels.push(...Object.values(testCase.dimensions))
  labels.push(`generation-${testCase.generation}`)
  labels.push(DISTRO)
  const outIssue: GithubIssue = {
    title: testCase.name,
    body: testCaseToMd(testCase),
    labels,
  }
  return outIssue
}
