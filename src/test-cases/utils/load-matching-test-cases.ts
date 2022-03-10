import * as constants from '../../constants'
import loadTestCases from './load-test-cases'

export default function loadMatchingTestCases(regex: string) {
  return loadTestCases(constants.outputTestCasePath).filter((testCase) => {
    const nameMatch = testCase.name.match(regex)
    const descriptionMatch = testCase.description?.match(regex)
    const dimensionMatches = Object.values(testCase.dimensions).some(
      (requirement) => {
        return requirement.match(regex)
      },
    )
    const labelMatch = testCase.labels?.some((label) => {
      return label.match(regex)
    })
    return nameMatch || descriptionMatch || dimensionMatches || labelMatch
  })
}
