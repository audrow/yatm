import * as constants from '../constants'
import copyYaml from '../requirements/generator/copy-yaml'
import ros2Docs from '../requirements/generator/ros2-docs'
import type Plugins from './__types__/Plugins_'

// TODO expose options, possibly through config
const requirementsGeneratorPlugins: Plugins = {
  'copy-yaml': async () => {
    copyYaml(constants.inputRequirementsPath, constants.outputRequirementsPath)
  },
  docs: async () => {
    await ros2Docs(constants.outputRequirementsPath)
  },
}

export default requirementsGeneratorPlugins
