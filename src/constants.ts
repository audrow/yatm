import 'dotenv/config'
import fs from 'fs'
import {join} from 'path'
import {z} from 'zod'
import type Repo from './test-cases/db/github/__types__/Repo'

// =================================================================================================
// Define the names of the environment variables that will be retrieved.
const envSchema = z.object({
  YATM_TEST_CASE_CONFIG_PATH: z.string(),
  YATM_REQUIREMENTS_DIRECTORY_PATH: z.string(),
  YATM_OUTPUT_DIRECTORY_PATH: z
    .string()
    .default(join(process.cwd(), 'generated-files')),
  GITHUB_REPO_OWNER: z.string(),
  GITHUB_REPO_NAME: z.string(),
  GITHUB_TOKEN: z.string(),
})

const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
  if (issue.code === z.ZodIssueCode.invalid_type) {
    if (issue.received === 'undefined') {
      return {
        message: 'Required environment variable ' + issue.path + ' not set.',
      }
    }
  }
  return {message: ctx.defaultError}
}

z.setErrorMap(customErrorMap)

export const CODE_URL = 'https://github.com/audrow/yatm'

// =================================================================================================
// Retrieve the environment variables and define other constants to export.
const result = envSchema.safeParse(process.env)

if (!result.success) {
  for (const issue of result.error.issues) {
    console.log(issue['message'])
  }
  process.exit(1)
}

const ENV = result.data

export const TEST_CASE_CONFIG = ENV.YATM_TEST_CASE_CONFIG_PATH
export const INPUT_REQUIREMENTS_PATH = ENV.YATM_REQUIREMENTS_DIRECTORY_PATH
export const OUTPUT_PATH = ENV.YATM_OUTPUT_DIRECTORY_PATH
export const OUTPUT_REQUIREMENTS_PATH = join(OUTPUT_PATH, 'requirements')
export const OUTPUT_TEST_CASE_PATH = join(OUTPUT_PATH, 'test-cases')
export const OUTPUT_TEST_CASE_RENDER_PATH = join(
  OUTPUT_PATH,
  'rendered-test-cases',
)

export const GITHUB_TOKEN = ENV.GITHUB_TOKEN
export const GITHUB_RETRY_SECONDS = 60 * 5
export const REPOSITORY: Repo = {
  owner: ENV.GITHUB_REPO_OWNER,
  name: ENV.GITHUB_REPO_NAME,
}

// TODO(YV): Update to YATM_DISTRO_LABEL
export const DISTRO_LABEL = 'iron'

const packageXml = JSON.parse(
  fs.readFileSync(join(process.cwd(), 'package.json'), 'utf8'),
)
export const VERSION = packageXml.version
