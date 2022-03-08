import type Plugins from '../types/plugins'

const checksMarkupPlugins: Plugins = {
  stdin: async () => {
    console.log('markup stdin')
  },
  stdout: async () => {
    console.log('markup stdout')
  },
  stderr: async () => {
    console.log('markup stderr')
  },
  image: async () => {
    console.log('markup image')
  },
  text: async () => {
    console.log('markup text')
  },
}

export default checksMarkupPlugins
