import type Plugins from '../types/plugins'

const requirementsGeneratorPlugins: Plugins = {
  'copy-yaml': async () => {
    console.log('generate requirements from yaml')
  },
  docs: async () => {
    console.log('generate requirements from docs site')
  },
}

export default requirementsGeneratorPlugins
