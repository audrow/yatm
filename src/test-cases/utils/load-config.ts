import fs from 'fs'
import yaml from 'js-yaml'
import type Config from '../__types__/Config'
import validateConfigYaml from './validate-requirements-filter-yaml'

function loadConfig(path: string) {
  const config = yaml.load(fs.readFileSync(path, 'utf8')) as Config
  validateConfigYaml(config, path)
  return config
}

export default loadConfig
