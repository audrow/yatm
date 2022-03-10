import 'dotenv/config'
import {join} from 'path'

export const TEST_CASE_CONFIG = join(process.cwd(), 'test-case.config.yaml')

const REQUIREMENTS_DIRECTORY = 'requirements'
const OUTPUT_DIRECTORY = 'generated-files'
const TEST_CASES_DIRECTORY = 'test-cases'
const RENDERED_TEST_CASE_DIRECTORY = 'rendered-test-cases'

export const INPUT_REQUIREMENTS_PATH = join(
  process.cwd(),
  REQUIREMENTS_DIRECTORY,
)
export const OUTPUT_PATH = join(process.cwd(), OUTPUT_DIRECTORY)
export const OUTPUT_REQUIREMENTS_PATH = join(
  OUTPUT_PATH,
  REQUIREMENTS_DIRECTORY,
)
export const OUTPUT_TEST_CASE_PATH = join(OUTPUT_PATH, TEST_CASES_DIRECTORY)
export const OUTPUT_TEST_CASE_RENDER_PATH = join(
  OUTPUT_PATH,
  RENDERED_TEST_CASE_DIRECTORY,
)

export const TRANSLATION_MAP = {
  jammy: 'Ubuntu Jammy',
  installType: 'Install type',
  fastdds: 'FastDDS',
  dds: 'DDS vendor',
}
