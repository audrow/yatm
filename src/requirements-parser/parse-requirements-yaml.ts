import yaml from 'js-yaml'
import type Requirements from '../__types__/Requirements'
import type RequirementParser from '../__types__/RequirementsParser'

const parseRequirementsYaml: RequirementParser = (text) => {
  return yaml.load(text) as Requirements
}

export default parseRequirementsYaml
