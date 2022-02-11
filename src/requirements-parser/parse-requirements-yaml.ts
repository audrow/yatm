import yaml from 'js-yaml'

import type RequirementParser from '../__types__/RequirementsParser'
import type Requirements from '../__types__/Requirements'

const parseRequirementsYaml: RequirementParser = (text) => {
  return yaml.load(text) as Requirements
}

export default parseRequirementsYaml
