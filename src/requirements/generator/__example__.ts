import setupOutputDirectory from '../../cli/utils/setup-output-directory'
import * as constants from '../../constants'
import copyYaml from './copy-yaml/copy-yaml'
import ros2Docs from './ros2-docs/ros2-docs'

if (typeof require !== 'undefined' && require.main === module) {
  setupOutputDirectory()
  copyYaml(
    constants.INPUT_REQUIREMENTS_PATH,
    constants.OUTPUT_REQUIREMENTS_PATH,
  )
  ros2Docs(constants.OUTPUT_REQUIREMENTS_PATH)
}
