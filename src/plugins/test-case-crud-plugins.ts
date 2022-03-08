import type Plugins from './__types__/Plugins'

const testCaseCrudPlugins: Plugins = {
  github: async () => {
    console.log('github CRUD')
  },
  local: async () => {
    console.log('local CRUD')
  },
}

export default testCaseCrudPlugins
