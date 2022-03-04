import endent from 'endent'
import type Requirement from '../__types__/Requirement'

export default function warnOnDuplicateRequirementNames(
  requirements: Requirement[],
  isTerminateOnError = false,
) {
  const requirementsWithSameNameMap: {[name: string]: Requirement[]} = {}
  requirements.forEach((requirement) => {
    const requirementsWithSameName = requirements.filter(
      (r) => r.name === requirement.name,
    )
    if (
      requirementsWithSameName.length > 1 &&
      !requirementsWithSameNameMap[requirement.name]
    ) {
      requirementsWithSameNameMap[requirement.name] = requirementsWithSameName
    }
  })

  if (Object.keys(requirementsWithSameNameMap).length > 0) {
    Object.entries(requirementsWithSameNameMap).forEach(
      ([name, requirementsWithSameName]) => {
        console.warn(endent`
        '${name}' has ${
          requirementsWithSameName.length
        } requirements with the same name - labels:
        ${requirementsWithSameName
          .map((requirement) => {
            return `  - ${requirement.labels?.join(', ')}`
          })
          .join('\n')}
      `)
      },
    )
    const errorMessage =
      'There are requirements with the same name - try filtering them'
    if (isTerminateOnError) {
      console.error(`ERROR: ${errorMessage}`)
      process.exit(1)
    } else {
      console.warn(`Warning: ${errorMessage}`)
    }
  }
}
