import TestCase from '../__types__/TestCase'

export default function sortTestCases(a: TestCase, b: TestCase) {
  if (a.name < b.name) {
    return -1
  }
  if (a.name > b.name) {
    return 1
  }
  return 0
}
