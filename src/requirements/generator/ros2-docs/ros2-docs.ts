import endent from 'endent'
import fs from 'fs'
import yaml from 'js-yaml'
import {join} from 'path'
import urlParse from 'url-parse'
import {DISTRO} from '../../../constants'
import validateRequirements from '../../validator/validate-requirements'
import type Requirement from '../../__types__/Requirement'
import {errorIfFileExists} from '../utils'
import getFromSiteMap from './get-pages-from-sitemap'

async function makeDocumentationRequirementFiles(
  outputDirectory: string,
  distro = DISTRO,
  baseUrl = 'https://docs.ros.org/en/',
  sections: string[] = ['Install', 'Tutorials', 'How-to-guide'],
  documentationLabel = 'docs',
) {
  const pages = await getFromSiteMap(distro, baseUrl, sections)
  const requirements = pages.map((page) => {
    const out: Requirement = {
      name: page.name,
      labels: [...page.labels, documentationLabel],
      description: `Check the documentation for the '${page.name}' page`,
      links: [
        {
          name: `${page.name} page`,
          url: page.url,
        },
      ],
      checks: [
        {
          name: 'I was able to follow the documentation.',
        },
        {
          name: 'The documentation seemed clear to me.',
        },
        {
          name: "The documentation didn't have any obvious errors.",
        },
      ],
    }
    return out
  })
  const text = endent`
    # This test case was generated by scraping ${baseUrl} on ${distro} for the following sections:
    ${sections.map((s) => `# - ${s}`).join('\n')}
    #
    # This test case has been validated

    ${yaml.dump({requirements})}
  `
  const requirementsYaml = yaml.load(text)
  validateRequirementsYaml(requirementsYaml)

  const host = urlParse(baseUrl).host
  const outputFile = join(outputDirectory, `${host}.yaml`)

  errorIfFileExists(outputFile)
  fs.writeFileSync(outputFile, text)
}

function validateRequirementsYaml(loadedText: unknown) {
  const error = validateRequirements(loadedText)
  if (error) {
    console.error(error)
    console.error(`ERROR: Couldn't validate requirements`)
    process.exit(1)
  }
}

export default makeDocumentationRequirementFiles
