import fs from 'fs'
import {join} from 'path'

import validateRequirements from './validate-requirements'
import parseRequirementsYaml from './requirements-parser/parse-requirements-yaml'

import type Requirement from './__types__/Requirement'
import type {Dds, InstallType, Platform} from './__types__/TestsCase'

import testCaseToMd from './test-case-renderer/test-case-to-md'

const reqPath = join(__dirname, '__tests__', 'requirements.yaml')
const reqStr = fs.readFileSync(reqPath, 'utf8')
const req = parseRequirementsYaml(reqStr)
const isValid = validateRequirements(req)
if (!isValid) {
  console.error('Invalid requirements file - exiting with code 1')
  process.exit(1)
}

function requirementToTestCase(
  req: Requirement,
  platform: Platform,
  dds: Dds,
  installType: InstallType,
) {
  return {
    installType,
    platform,
    dds,
    ...req,
  }
}

const tc = req.requirements
  .map((r) =>
    testCaseToMd(requirementToTestCase(r, 'jammy', 'fastdds', 'source')),
  )
  .join('\n\n---')
console.log(tc)
