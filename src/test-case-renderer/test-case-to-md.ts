import endent from 'endent'

import type TestCase from '../__types__/TestsCase'
import type Step from '../__types__/Step'

export default testCaseToMd

function testCaseToMd(
  testCase: TestCase,
  translationMap?: {[key: string]: string},
) {
  return endent`
    # ${testCase.name}

    ## Setup
    ${Object.entries(testCase.dimensions)
      .map(([key, value]) => {
        if (translationMap) {
          key = translationMap[key] || key
          value = translationMap[value] || value
        }
        key = key[0].toUpperCase() + key.slice(1)
        value = value[0].toUpperCase() + value.slice(1)
        return `- ${key}: ${value}`
      })
      .join('\n')}

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
  if (step.stdout) {
    out += endent`
      \`\`\`bash
      # stdout in terminal ${step.terminal}
      ${step.stdout.trim()}
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

if (typeof require !== 'undefined' && require.main === module) {
  const map = {
    jammy: 'Ubuntu Jammy',
    installType: 'Install type',
    fastdds: 'FastDDS',
    dds: 'DDS vendor',
  }
  const testCase: TestCase = {
    name: 'test case',
    dimensions: {
      platform: 'jammy',
      dds: 'fastdds',
      installType: 'source',
    },
    generation: 37,
    checks: [
      {
        name: 'check',
        try: [
          {
            note: 'try',
            terminal: 1,
            stderr: 'stderr',
          },
        ],
        expect: [
          {
            note: 'expect',
            terminal: 1,
            stdout: 'stdout',
          },
          {
            note: 'expect',
            imageUrl: 'image url',
          },
        ],
      },
      {
        name: 'Name only check',
      },
      {
        name: 'Name only check 2',
      },
    ],
  }
  const out = testCaseToMd(testCase, map)
  console.log(out)
}
