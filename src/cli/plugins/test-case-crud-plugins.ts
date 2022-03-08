import type Plugins from '../types/plugins'

const testCaseCrudPlugins: Plugins = {
  github: async () => {
    console.log('github CRUD')
  },
  local: async () => {
    console.log('local CRUD')
  },
}

export default testCaseCrudPlugins
