import fs from 'fs'
import {join} from 'path'
import yaml from 'js-yaml'
import endent from 'endent'

import {gatherRequirements} from './lib/gather-requirements'
import {
  outputPath,
  outputRequirementsPath,
  outputTestCasePath,
} from './lib/constants'
import Requirements from './__types__/Requirements'
import Requirement from './__types__/Requirement'

// export type Platform = 'jammy' | 'windows' | 'rhel' | 'focal'
// export type Dds = 'fastdds' | 'cyclone' | 'connext'
// export type InstallType = 'binary' | 'source'

async function initGeneratedFilesDirectory() {
  if (fs.existsSync(outputPath)) {
    fs.rmSync(outputPath, {recursive: true})
  }
  fs.mkdirSync(outputRequirementsPath, {recursive: true})
  fs.mkdirSync(outputTestCasePath, {recursive: true})
}

function loadRequirements(path: string) {
  const requirements: Requirement[] = []
  fs.readdirSync(path).forEach((file) => {
    requirements.push(
      ...(yaml.load(fs.readFileSync(join(path, file), 'utf8')) as Requirements)
        .requirements,
    )
  })

  return requirements.sort((a, b) => {
    return a.name.localeCompare(b.name)
  })
}

function warnOnDuplicateRequirementNames(requirements: Requirement[]) {
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
    console.warn(
      `WARNING: There are requirements with the same name - consider excluding them`,
    )
  }
}

type RequirementFilter = {
  labels?: string[]
  name?: string
  regexOptions?: string
}
// Partial<Pick<Requirement, 'name' | 'labels'>>

function filterRequirements(
  requirements: Requirement[],
  filters: RequirementFilter | RequirementFilter[],
  isMatch = true,
) {
  if (!Array.isArray(filters)) {
    filters = [filters]
  }
  for (const filter of filters) {
    if (requirements.length === 0) {
      return []
    }
    if (filter.name) {
      requirements = requirements.filter((r) => {
        const titleRegex = new RegExp(filter.name!, filter.regexOptions)
        const match = r.name.match(titleRegex)
        return isMatch ? match : !match
      })
    }
    if (filter.labels) {
      requirements = requirements.filter((r) => {
        const match = filter.labels!.every((label) => {
          const labelRegex = new RegExp(label, filter.regexOptions)
          return r.labels?.some((rLabel) => rLabel.match(labelRegex))
        })
        return isMatch ? match : !match
      })
    }
  }
  return requirements
}

async function main() {
  await initGeneratedFilesDirectory()
  const inputRequirementsPath = join(__dirname, '..', 'requirements')
  await gatherRequirements(inputRequirementsPath, outputRequirementsPath)

  let requirements = loadRequirements(outputRequirementsPath)

  requirements = filterRequirements(requirements, [
    {
      name: 'Broadcaster',
      labels: ['docs'],
    },
    {
      name: 'static',
      regexOptions: 'i',
    },
  ])

  console.log(
    requirements.map((r) => `${r.name} - ${r.labels?.join(', ')}`).join('\n'),
  )

  warnOnDuplicateRequirementNames(requirements)
}

if (typeof require !== 'undefined' && require.main === module) {
  main()
}
