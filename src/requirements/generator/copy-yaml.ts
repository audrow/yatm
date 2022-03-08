import endent from 'endent'
import fs from 'fs'
import yaml from 'js-yaml'
import {join, resolve} from 'path'
import type Requirements from '../__types__/Requirements'
import {errorIfFileExists, validateRequirementsYaml} from './utils'

function copyRequirementFiles(inputPath: string, outputPath: string) {
  fs.readdirSync(inputPath).forEach((file) => {
    const filePath = join(inputPath, file)
    const requirementsYaml = yaml.load(
      fs.readFileSync(filePath, 'utf8'),
    ) as Requirements

    validateRequirementsYaml(requirementsYaml)

    const outputFilePath = join(outputPath, file)
    const outText = endent`
      # The original file was located here: ${resolve(filePath)}
      #
      # This test case has been validated

      ${yaml.dump(requirementsYaml)}
    `

    errorIfFileExists(outputFilePath)
    fs.writeFileSync(outputFilePath, outText)
  })
}

export default copyRequirementFiles
