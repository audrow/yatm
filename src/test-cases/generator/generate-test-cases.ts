import combinate from 'combinate'
import type Requirement from '../../requirements/__types__/Requirement'
import type RequirementFilter from '../__types__/RequirementFilter'
import type TestCase from '../__types__/TestCase'
import type TestCaseDimensions from '../__types__/TestCaseDimensions'
import warnOnDuplicateRequirementNames from './warn-on-duplicate-requirement-names'

export default function generateTestCases({
  requirements,
  dimensions,
  generation,
  filters,
  isTerminateOnError = true,
}: {
  requirements: Requirement[]
  dimensions: TestCaseDimensions
  generation: number
  filters: RequirementFilter | RequirementFilter[]
  isTerminateOnError?: boolean
}) {
  if (requirements.length === 0) {
    console.warn('No requirements found')
  }
  const outputRequirements = filterRequirements(requirements, filters)
  warnOnDuplicateRequirementNames(outputRequirements, isTerminateOnError)

  const testCases = getTestCasesFromRequirements(
    outputRequirements,
    dimensions,
    generation,
  )
  if (testCases.length === 0) {
    console.warn(
      `No test cases generated for generation ${generation} with filters ${JSON.stringify(
        filters,
      )}`,
    )
  }
  return testCases
}

function filterRequirements(
  requirements: Requirement[],
  filters: RequirementFilter | RequirementFilter[],
  remove_duplicates = true,
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
  // Remove requirements with duplicate names by selecting the requirement
  // with the greater number of labels.
  const original_count: number = requirements.length
  if (remove_duplicates) {
    const requirementsWithSameNameMap: {[name: string]: Requirement[]} = {}
    requirements.forEach((requirement) => {
      if (!requirementsWithSameNameMap[requirement.name]) {
        const requirementsWithSameName = requirements.filter(
          (r) => r.name === requirement.name,
        )
        if (requirementsWithSameName.length > 1) {
          requirementsWithSameNameMap[requirement.name] =
            requirementsWithSameName
        }
      }
    })

    Object.entries(requirementsWithSameNameMap).forEach(
      ([, requirementsWithSameName]) => {
        const requirementsToRemove: Requirement[] =
          requirementsWithSameName.sort((r1, r2) => {
            if (r1.labels && r2.labels && r1.labels.length > r2.labels.length) {
              return 1
            }

            if (r1.labels && r2.labels && r1.labels.length < r2.labels.length) {
              return -1
            }
            return 0
          })
        // Pop the last element which is the requirement we want to keep.
        // Delete remaining requirements.
        requirementsToRemove.pop()
        requirementsToRemove.forEach((r: Requirement) => {
          const index = requirements.indexOf(r)
          if (index > -1) {
            requirements.splice(index, 1)
          }
        })
      },
    )
    const final_count: number = requirements.length
    console.log('Removed %i duplicates', original_count - final_count)
  }

  return requirements
}

function getTestCasesFromRequirements(
  requirements: Requirement[],
  dimensions: TestCaseDimensions,
  generation: number,
) {
  const testCases: TestCase[] = []
  const dimensionCombinations = generateTestCaseCombinations(dimensions)
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

export function generateTestCaseCombinations(dimensions: TestCaseDimensions) {
  return combinate(dimensions)
}
