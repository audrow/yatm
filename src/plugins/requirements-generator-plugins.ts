import type Plugins from './__types__/plugins'

const requirementsGeneratorPlugins: Plugins = {
  'copy-yaml': async () => {
    console.log('generate requirements from yaml')
  },
  docs: async () => {
    console.log('generate requirements from docs site')
  },
}

export default requirementsGeneratorPlugins
