type Plugins = {
  [name: string]: (args: unknown[]) => Promise<void>
}

export default Plugins
