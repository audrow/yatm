import fs from 'fs'
import {join} from 'path'
import yaml from 'js-yaml'

import {gatherRequirements} from './lib/gather-requirements'
import {
  outputPath,
  outputRequirementsPath,
  outputTestCasePath,
} from './lib/constants'
import generateTestCases from './lib/generate-test-cases'

import Requirements from './__types__/Requirements'
import Requirement from './__types__/Requirement'
import warnOnDuplicateRequirementNames from './lib/warn-on-duplicate-requirement-names'

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

async function main() {
  await initGeneratedFilesDirectory()
  const inputRequirementsPath = join(__dirname, '..', 'requirements')
  await gatherRequirements(inputRequirementsPath, outputRequirementsPath)

  const requirements = loadRequirements(outputRequirementsPath)
  warnOnDuplicateRequirementNames(requirements, false)

  const filters = [
    {
      labels: ['^launch$'],
      isMatch: false,
    },
    {
      name: 'tutorial',
      regexOptions: 'i',
      isMatch: true,
    },
  ]
  const dimensions = {
    dds: ['fastdds', 'connext'],
    installType: ['binary'],
    platform: ['jammy'],
  }
  const generation = 1

  generateTestCases({
    requirements,
    dimensions,
    generation,
    filters,
    outputDirectory: outputTestCasePath,
    isDryRun: true,
  })
}

if (typeof require !== 'undefined' && require.main === module) {
  main()
}
