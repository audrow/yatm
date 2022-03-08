import 'dotenv/config'
import {join} from 'path'

export const GITHUB_API_TOKEN =
  process.env.GITHUB_API_TOKEN || 'GITHUB_API_TOKEN is not set'

const requirementsDirectory = 'requirements'
const outputDirectory = 'generated-files'
const testCasesDirectory = 'test-cases'
const renderedTestCaseDirectory = 'rendered-test-cases'
export const inputRequirementsPath = join(process.cwd(), requirementsDirectory)
export const outputPath = join(process.cwd(), outputDirectory)
export const outputRequirementsPath = join(outputPath, requirementsDirectory)
export const outputTestCasePath = join(outputPath, testCasesDirectory)
export const outputTestCaseRenderPath = join(
  outputPath,
  renderedTestCaseDirectory,
)

export const translationMap = {
  jammy: 'Ubuntu Jammy',
  installType: 'Install type',
  fastdds: 'FastDDS',
  dds: 'DDS vendor',
}
