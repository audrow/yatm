import setupOutputDirectory from '../../../cli/utils/setup-output-directory'

if (typeof require !== 'undefined' && require.main === module) {
  setupOutputDirectory()
}
