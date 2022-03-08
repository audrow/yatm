import type Plugins from '../__types__/plugins'

const testCaseCrudPlugins: Plugins = {
  github: async () => {
    console.log('github CRUD')
  },
  local: async () => {
    console.log('local CRUD')
  },
}

export default testCaseCrudPlugins
