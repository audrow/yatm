import type Plugins from './types/plugins'

const generateRequirementsPlugins: Plugins = {
  'from-yaml': async () => {
    console.log('generate requirements from yaml')
  },
  'from-docs-site': async () => {
    console.log('generate requirements from docs site')
  },
}

export default generateRequirementsPlugins
