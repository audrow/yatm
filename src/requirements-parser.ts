import fs from 'fs'
import {join} from 'path'

import validateRequirements from './validate-requirements'
import parseRequirementsYaml from './requirements-parser/parse-requirements-yaml'
import requirementToTestCase from './lib/requirement-to-test-case'
import testCaseToMd from './test-case-renderer/test-case-to-md'

const reqPath = join(__dirname, '__tests__', 'requirements.yaml')
const reqStr = fs.readFileSync(reqPath, 'utf8')
const req = parseRequirementsYaml(reqStr)
const isValid = validateRequirements(req)
if (!isValid) {
  console.error('Invalid requirements file - exiting with code 1')
  process.exit(1)
}

const tc = req.requirements
  .map((r) =>
    testCaseToMd(requirementToTestCase(r, 'jammy', 'fastdds', 'source')),
  )
  .join('\n\n---')
console.log(tc)
