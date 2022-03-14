import setupOutputDirectory from '../../../cli/utils/setup-output-directory'
import * as constants from '../../../constants'
import ros2Docs from '../ros2-docs/ros2-docs'

if (typeof require !== 'undefined' && require.main === module) {
  setupOutputDirectory()
  ros2Docs(constants.OUTPUT_REQUIREMENTS_PATH)
}
