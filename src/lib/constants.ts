import 'dotenv/config'
import {join} from 'path'

export const GITHUB_API_TOKEN =
  process.env.GITHUB_API_TOKEN || 'GITHUB_API_TOKEN is not set'

const requirementsDirectory = 'requirements'
const outputDirectory = 'generated-files'
const testCasesDirectory = 'test-cases'
export const outputPath = join(__dirname, '..', '..', outputDirectory)
export const outputRequirementsPath = join(outputPath, requirementsDirectory)
export const outputTestCasePath = join(outputPath, testCasesDirectory)
