import type Plugins from '../__types__/plugins'

const markupPlugins: Plugins = {
  md: async () => {
    console.log('markup md')
  },
  html: async () => {
    console.log('markup html')
  },
}

export default markupPlugins
