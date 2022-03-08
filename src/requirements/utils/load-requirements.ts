import fs from 'fs'
import yaml from 'js-yaml'
import {join} from 'path'
import type Requirement from '../__types__/Requirement'
import type Requirements from '../__types__/Requirements'

function loadRequirements(directoryPath: string) {
  const requirements: Requirement[] = []
  const files = fs.readdirSync(directoryPath)
  if (files.length === 0) {
    throw new Error(`No files found in ${directoryPath}`)
  }
  files.forEach((file) => {
    requirements.push(
      ...(
        yaml.load(
          fs.readFileSync(join(directoryPath, file), 'utf8'),
        ) as Requirements
      ).requirements,
    )
  })

  return requirements.sort((a, b) => {
    return a.name.localeCompare(b.name)
  })
}

export default loadRequirements
