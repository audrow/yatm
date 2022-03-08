import * as constants from '../../constants'
import setupOutputDir from '../../plugins/setup-output-dir'
import copyYaml from './copy-yaml'
import ros2Docs from './ros2-docs'

if (typeof require !== 'undefined' && require.main === module) {
  setupOutputDir()
  copyYaml(constants.inputRequirementsPath, constants.outputRequirementsPath)
  ros2Docs(constants.outputRequirementsPath)
}
