import {parse} from 'csv/sync'
import endent from 'endent'
import fs from 'fs'
import yaml from 'js-yaml'
import {join} from 'path'
import {validateRequirementsYaml} from '../src/requirements/generator/utils'
import type Requirement from '../src/requirements/__types__/Requirement'

type Features = Record<string, string[]>

function getPackageExecutables(content: string) {
  const rawFeatures = parse(content)
  const features: Features = {}
  let lastPackage: string
  rawFeatures.forEach((record: string[2]) => {
    const [package_, executables] = record
    if (package_.trim() !== '') {
      lastPackage = package_
    }
    if (!features[lastPackage]) {
      features[lastPackage] = []
    }
    features[lastPackage].push(...executables.split(',').map((e) => e.trim()))
  })
  return features
}

function getRequirementsYaml(features: Features, labels: string[]) {
  const requirements = Object.entries(features).map((feature) => {
    const [packageName, executables] = feature
    const requirement: Requirement = {
      name: `Executables in \`${packageName}\``,
      labels: [...labels],
      checks: executables.map((executable) => {
        return {
          name: `Check \`${executable}\``,
          try: [
            {
              stdin: `ros2 run ${packageName} ${executable}`,
            },
          ],
          expect: [
            {
              note: 'It works',
            },
          ],
        }
      }),
    }
    return requirement
  })
  const requirements_ = {
    requirements: requirements,
  }
  validateRequirementsYaml(requirements_)
  return endent`
    # This requirements file is not perfect but it should be a useful starting point.
    # It is intended to be copied into the saved requirements directory and then modified.

    ${yaml.dump(requirements_)}
  `
}

const filePath = join(__dirname, 'executable-features.csv')
const labels = ['executable', 'feature']
const outputfile = join(__dirname, 'features-executable.yaml')

const content = fs.readFileSync(filePath, 'utf8')
const features = getPackageExecutables(content)
const yaml_ = getRequirementsYaml(features, labels)
fs.writeFileSync(outputfile, yaml_)
