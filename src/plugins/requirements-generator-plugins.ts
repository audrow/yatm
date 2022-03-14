import * as constants from '../constants'
import copyYaml from '../requirements/generator/copy-yaml/copy-yaml'
import ros2Docs from '../requirements/generator/ros2-docs/ros2-docs'
import type Plugins from './__types__/Plugins'

// TODO expose options, possibly through config
const requirementsGeneratorPlugins: Plugins = {
  'copy-yaml': async () => {
    copyYaml(
      constants.INPUT_REQUIREMENTS_PATH,
      constants.OUTPUT_REQUIREMENTS_PATH,
    )
  },
  docs: async () => {
    await ros2Docs(constants.OUTPUT_REQUIREMENTS_PATH)
  },
}

export default requirementsGeneratorPlugins
