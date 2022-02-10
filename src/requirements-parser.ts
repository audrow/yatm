import yaml from 'js-yaml'
import endent from 'endent'
import fs from 'fs'
import {join} from 'path'

type Requirements = {
  requirements: Requirement[]
}

type Platform = 'jammy' | 'windows' | 'rhel' | 'focal'
type Dds = 'fastdds' | 'cyclone' | 'connext'
type InstallType = 'binary' | 'source'

type TestCase = {
  platform: Platform
  dds: Dds
  installType: InstallType
} & Requirement

type Requirement = {
  name: string
  description?: string
  labels?: string[]
  checks: Check[]
}

type Check = {
  name: string
  try?: Step[]
  expect?: Step[]
}

type Step = Partial<{
  terminal: number
  imageUrl: string
  note: string
  stdin: string
  stout: string
  stderr: string
}>

const reqPath = join(__dirname, '__tests__', 'requirements.yaml')
const reqStr = fs.readFileSync(reqPath, 'utf8')
const req = yaml.load(reqStr) as Requirements

console.log(req.requirements[0].checks)

function getStep(step: Step) {
  step.terminal = step.terminal || 1

  let out = ''
  if (step.note) {
    out += step.note + '\n'
  }
  if (step.imageUrl) {
    out += `![](${step.imageUrl})` + '\n'
  }
  if (step.stdin) {
    out += endent`
      \`\`\`bash
      # User input in terminal ${step.terminal}
      ${step.stdin.trim()}
      \`\`\`
    `
  }
  if (step.stout) {
    out += endent`
      \`\`\`bash
      # stdout in terminal ${step.terminal}
      ${step.stout.trim()}
      \`\`\`
    `
  }
  if (step.stderr) {
    out += endent`
      \`\`\`bash
      # stderr in terminal ${step.terminal}
      ${step.stderr.trim()}
      \`\`\`
    `
  }
  return out
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

function testCaseToMd(testCase: TestCase) {
  return endent`
    ${testCase.name}

    ## Setup
    - Platform: ${testCase.platform}
    - Install Type: ${testCase.installType}
    - DDS: ${testCase.dds}

    ## Checks
    ${testCase.checks
      .map((check) => {
        return endent`
          - [ ] ${check.name}

            ${
              !(check.try && check.expect)
                ? ''
                : endent`
              <details><summary>details</summary>

                **Try**

                ${check.try
                  .map(
                    (s) => endent`
                  1.
                     ${getStep(s)}`,
                  )
                  .join('\n')}

                **Expect**

                ${check.expect
                  .map(
                    (s) => endent`
                  1.
                     ${getStep(s)}`,
                  )
                  .join('\n')}

              </details>
            `
            }
        `
      })
      .join('\n')}
  `
}

const tc = testCaseToMd(
  requirementToTestCase(req.requirements[0], 'jammy', 'fastdds', 'source'),
)
console.log(tc)
