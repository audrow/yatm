import endent from 'endent'

import type TestCase from '../__types__/TestsCase'
import type Step from '../__types__/Step'

export default testCaseToMd

function testCaseToMd(testCase: TestCase) {
  return endent`
    # ${testCase.name}

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
