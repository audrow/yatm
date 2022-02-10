import yaml from 'js-yaml'
import endent from 'endent'

type Requirements = {
  requirements: Requirement[]
}

type Requirement = {
  name: string
  description?: string
  labels?: string[]
  checks: Check[]
}

type Check = {
  name?: string
  try: Step[]
  expect: Step[]
}

type Step = Partial<{
  terminal: number
  imageUrl: string
  note: string
  stdin: string
  stout: string
  stderr: string
}>

const yamlString = endent`
  requirements:
    - name: Test ROS 2 Topic
      labels:
        - ros2cli
      url: https://github.com/ros2/ros2cli
      checks:
        - name: ROS2 Topic help
          try:
            - stdin: ros2 topic show --help
          expect:
            - stout: /greet
        - name: ROS 2 Topic echo
          try:
            - note: Run this once
              stdin: ros2 topic echo /greet --once
            - imageUrl: https://img.search.brave.com/TBRxzNr6M8Enl8QPxfadgwmwEdKnYY1yUuyCsg50AYI/rs:fit:200:200:1/g:ce/aHR0cHM6Ly9hd3Mx/LmRpc2NvdXJzZS1j/ZG4uY29tL2dpdGh1/Yi9vcmlnaW5hbC8y/WC9kL2Q0MTY3NmM5/YmY5ZmJhYThlZGJl/NzZlZjM0NzQ0ZjM4/MDg5ZDA0NzQuc3Zn.svg
              note: It should look like this image
            - stdin: ros2 topic echo /greet --twice
          expect:
            - note: Will say hello once
            - stdout: |
                Hello
                Hello
              stderr: None
        - name: ROS2 Topic help
          # instructions: Run the following in a terminal (optional)
          try:
            - stdin: |
                ros2 topic show -h
                ros2 topic show --help
          expect:
            - stout: /greet
`

const req = yaml.load(yamlString) as Requirements

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
      ${step.stdin}
      \`\`\`
    `
  }
  if (step.stout) {
    out += endent`
      \`\`\`bash
      # stdout in terminal ${step.terminal}
      ${step.stout}
      \`\`\`
    `
  }
  if (step.stderr) {
    out += endent`
      \`\`\`bash
      # stderr in terminal ${step.terminal}
      ${step.stderr}
      \`\`\`
    `
  }
  return out
}

function requirementToMd(requirement: Requirement) {
  return endent`
    ${requirement.name}

    ## Checks
    ${requirement.checks
      .map((check) => {
        return endent`
          - [ ] ${check.name}

            <details><summary>details</summary>

              ### Try

              ${check.try
                .map(
                  (s) => endent`
                1.
                   ${getStep(s)}`,
                )
                .join('\n')}

              ### Expect

              ${check.expect
                .map(
                  (s) => endent`
                1.
                   ${getStep(s)}`,
                )
                .join('\n')}

            </details>
        `
      })
      .join('\n')}
  `
}

console.log(requirementToMd(req.requirements[0]))
