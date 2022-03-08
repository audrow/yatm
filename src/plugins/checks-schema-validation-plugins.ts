import type Plugins from './__types__/Plugins'

const checksSchemaValidationPlugins: Plugins = {
  stdin: async () => {
    console.log('validate stdin')
  },
  stdout: async () => {
    console.log('validate stdout')
  },
  stderr: async () => {
    console.log('validate stderr')
  },
  image: async () => {
    console.log('validate image')
  },
  text: async () => {
    console.log('validate text')
  },
}

export default checksSchemaValidationPlugins
