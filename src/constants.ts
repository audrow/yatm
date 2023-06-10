import 'dotenv/config'
import fs from 'fs'
import {join} from 'path'
import type Repo from './test-cases/db/github/__types__/Repo'

// =================================================================================================
// Define the names of the environment variables that will be retireved.
export const TEST_CASE_CONFIG_PATH_ENVAR_NAME = 'YATM_TEST_CASE_CONFIG_PATH'
export const REQUIREMENTS_DIRECTORY_PATH_ENVAR_NAME =
  'YATM_REQUIREMENTS_DIRECTORY_PATH'
export const OUTPUT_DIRECTORY_PATH_ENVAR_NAME = 'YATM_OUTPUT_DIRECTORY_PATH'

export const GITHUB_REPO_OWNER_ENVAR_NAME = 'GITHUB_REPO_OWNER'
export const GITHUB_REPO_NAME_ENVAR_NAME = 'GITHUB_REPO_NAME'
export const GITHUB_TOKEN_ENVAR_NAME = 'GITHUB_TOKEN'
export const CODE_URL = 'https://github.com/audrow/yatm'

// =================================================================================================
// Retrieve the environment variables and define other constants to export.
export const TEST_CASE_CONFIG = extractStringEnvVar(
  TEST_CASE_CONFIG_PATH_ENVAR_NAME,
)
export const INPUT_REQUIREMENTS_PATH = extractStringEnvVar(
  REQUIREMENTS_DIRECTORY_PATH_ENVAR_NAME,
)

export const OUTPUT_PATH = extractStringEnvVar(
  OUTPUT_DIRECTORY_PATH_ENVAR_NAME,
  join(process.cwd(), 'generated-files'),
)
export const OUTPUT_REQUIREMENTS_PATH = join(OUTPUT_PATH, 'requirements')
export const OUTPUT_TEST_CASE_PATH = join(OUTPUT_PATH, 'test-cases')
export const OUTPUT_TEST_CASE_RENDER_PATH = join(
  OUTPUT_PATH,
  'rendered-test-cases',
)

export const GITHUB_TOKEN = extractStringEnvVar(GITHUB_TOKEN_ENVAR_NAME)
export const GITHUB_RETRY_SECONDS = 60 * 5
export const REPOSITORY: Repo = {
  owner: extractStringEnvVar(GITHUB_REPO_OWNER_ENVAR_NAME),
  name: extractStringEnvVar(GITHUB_REPO_NAME_ENVAR_NAME),
}

const packageXml = JSON.parse(
  fs.readFileSync(join(process.cwd(), 'package.json'), 'utf8'),
)
export const VERSION = packageXml.version

// =================================================================================================
// Helper function to retrieve environment variables or throw and error if unspecified.
export function extractStringEnvVar(
  key: keyof NodeJS.ProcessEnv,
  default_value = '',
): string {
  const value = process.env[key] || default_value

  if (value === undefined || value === '') {
    const message = `The environment variable "${key}" is not set.".`

    throw new Error(message)
  }

  return value
}
