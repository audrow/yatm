import 'dotenv/config'
import {join} from 'path'

export const configPath = join(process.cwd(), 'config.yaml')

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
