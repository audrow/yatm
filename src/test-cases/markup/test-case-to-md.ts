import endent from 'endent'
import {translationMap as tMap} from '../../constants'
import type Step from '../../requirements/__types__/Step'
import type TestCase from '../__types__/TestCase'

export default testCaseToMd

function testCaseToMd(
  testCase: TestCase,
  translationMap: {[key: string]: string} = tMap,
) {
  let text = ''

  if (Object.entries(testCase.dimensions).length > 0) {
    text = endent`
      ${text}

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
      `
  }

  if (testCase.links && testCase.links.length > 0) {
    text = endent`
      ${text}

      ## Links
      ${testCase.links
        .map((link) => {
          return `- [${link.name}](${link.url})`
        })
        .join('\n')}
    `
  }

  text = endent`
    ${text}

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
  return text
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

async function main() {
  const translationMap = (await import('../../constants')).translationMap
  const testCase: TestCase = {
    name: 'test case',
    dimensions: {
      platform: 'jammy',
      dds: 'fastdds',
      installType: 'source',
    },
    links: [
      {
        url: 'google.com',
        name: 'Google',
      },
      {
        url: 'Yandex.com',
        name: 'Yandex',
      },
    ],
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
  const out = testCaseToMd(testCase, translationMap)
  console.log(out)
}

if (typeof require !== 'undefined' && require.main === module) {
  main()
}
