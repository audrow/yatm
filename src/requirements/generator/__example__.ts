import setupOutputDirectory from '../../cli/utils/setup-output-directory'
import * as constants from '../../constants'
import copyYaml from './copy-yaml'
import ros2Docs from './ros2-docs'

if (typeof require !== 'undefined' && require.main === module) {
  setupOutputDirectory()
  copyYaml(constants.inputRequirementsPath, constants.outputRequirementsPath)
  ros2Docs(constants.outputRequirementsPath)
}
