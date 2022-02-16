import fs from 'fs'
import {join, resolve} from 'path'
import yaml from 'js-yaml'
import endent from 'endent'

import validateRequirements from './lib/validate-requirements'

import type Requirements from './__types__/Requirements'

export type Platform = 'jammy' | 'windows' | 'rhel' | 'focal'
export type Dds = 'fastdds' | 'cyclone' | 'connext'
export type InstallType = 'binary' | 'source'

function copyRequirementFiles(inputPath: string, outputPath: string) {
  const requirementNames = new Set<string>()
  fs.readdirSync(inputPath).forEach((file) => {
    const filePath = join(inputPath, file)
    const requirementsFile = yaml.load(
      fs.readFileSync(filePath, 'utf8'),
    ) as Requirements
    const error = validateRequirements(requirementsFile)

    if (error) {
      console.error(error)
      console.error(`ERROR: invalid requirements file: ${filePath}`)
      process.exit(1)
    }

    requirementsFile.requirements.forEach((requirement) => {
      if (requirementNames.has(requirement.name)) {
        console.error(
          `ERROR: ${requirement.name} is duplicated requirement name: ${filePath}`,
        )
        process.exit(1)
      } else {
        requirementNames.add(requirement.name)
      }
    })

    const outputFilePath = join(outputPath, file)
    const outText = endent`
      # This test case has been validated
      #
      # The original file was located here: ${resolve(filePath)}

      ${yaml.dump(requirementsFile)}
    `

    if (fs.existsSync(outputFilePath)) {
      console.error(
        `ERROR: Requirements file already exists: ${outputFilePath}`,
      )
      process.exit(1)
    }

    fs.writeFileSync(outputFilePath, outText)
  })
}

const outputDirectory = 'generated-files'
const requirementsDirectory = 'requirements'
const testCasesDirectory = 'test-cases'

const inputRequirementsPath = join(__dirname, '..', requirementsDirectory)

const outputPath = join(__dirname, '..', outputDirectory)
const outputRequirementsPath = join(outputPath, requirementsDirectory)
const outputTestCasePath = join(outputPath, testCasesDirectory)

fs.rmSync(outputPath, {recursive: true})
fs.mkdirSync(outputRequirementsPath, {recursive: true})
fs.mkdirSync(outputTestCasePath, {recursive: true})

copyRequirementFiles(inputRequirementsPath, outputRequirementsPath)
