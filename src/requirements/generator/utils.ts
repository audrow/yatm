import fs from 'fs'
import validateRequirements from '../validator/validate-requirements'

export function validateRequirementsYaml(loadedText: unknown) {
  const error = validateRequirements(loadedText)
  if (error) {
    console.error(error)
    console.error(`ERROR: Couldn't validate requirements`)
    process.exit(1)
  }
}

export function errorIfFileExists(filePath: string) {
  if (fs.existsSync(filePath)) {
    console.error(`ERROR: file already exists: ${filePath}`)
    process.exit(1)
  }
}
