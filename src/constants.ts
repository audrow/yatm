// import def from 'ajv/dist/vocabularies/discriminator'
import 'dotenv/config'
import fs from 'fs'
import {join} from 'path'
import type Repo from './test-cases/db/github/__types__/Repo'

const packageXml = JSON.parse(
  fs.readFileSync(join(process.cwd(), 'package.json'), 'utf8'),
)
export const VERSION = packageXml.version

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

// Define the names of the environment variables that will be retireved.
export const GITHUB_REPO_OWNER_ENVAR_NAME = 'GITHUB_REPO_OWNER'
export const GITHUB_REPO_NAME_ENVAR_NAME = 'GITHUB_REPO_NAME'
export const GITHUB_TOKEN_ENVAR_NAME = 'GITHUB_TOKEN'
export const CODE_URL = 'https://github.com/audrow/yatm'

// Retrieve the environment variables and define other constants to export.
export const GITHUB_TOKEN = extractStringEnvVar(GITHUB_TOKEN_ENVAR_NAME)
export const GITHUB_RETRY_SECONDS = 60 * 5
export const REPOSITORY: Repo = {
  owner: extractStringEnvVar(GITHUB_REPO_OWNER_ENVAR_NAME),
  name: extractStringEnvVar(GITHUB_REPO_NAME_ENVAR_NAME),
}

// Helper function to retrieve environment variables or throw and error if unspecified.
export function extractStringEnvVar(
  key: keyof NodeJS.ProcessEnv,
  default_value = undefined,
): string {
  const value = process.env[key] || default_value

  if (value === undefined) {
    const message = `The environment variable "${key}" cannot be "undefined".`

    throw new Error(message)
  }

  return value
}
