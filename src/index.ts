import fs from 'fs'
import {join} from 'path'

import {getRequirements} from './lib/get-requirements'
import {
  outputPath,
  outputRequirementsPath,
  outputTestCasePath,
} from './lib/constants'

export type Platform = 'jammy' | 'windows' | 'rhel' | 'focal'
export type Dds = 'fastdds' | 'cyclone' | 'connext'
export type InstallType = 'binary' | 'source'

async function main() {
  const inputRequirementsPath = join(__dirname, '..', 'requirements')

  if (fs.existsSync(outputPath)) {
    fs.rmSync(outputPath, {recursive: true})
  }
  fs.mkdirSync(outputRequirementsPath, {recursive: true})
  fs.mkdirSync(outputTestCasePath, {recursive: true})

  await getRequirements(inputRequirementsPath, outputRequirementsPath)
}

main()
