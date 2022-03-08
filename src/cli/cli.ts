import {Command, Option, program} from 'commander'
import sortObject from 'sort-object-keys'
import * as constants from '../constants'
import requirementsGeneratorPlugins from '../plugins/requirements-generator-plugins'
import markupPlugins from '../plugins/test-case-markup-plugins'
import type Plugins from '../plugins/__types__/Plugins'
import loadRequirements from '../requirements/utils/load-requirements'
import generateTestCases from '../test-cases/generator/generate-test-cases'
import loadConfig from '../test-cases/utils/load-config'
import setupOutputDir from './setup-output-dir'

function addRequirementsCommand(cmd: Command, plugins: Plugins) {
  plugins = sortObject(plugins)
  const requirementsCmd = cmd.command('requirements').aliases(['r', 'req'])

  const makeCmd = requirementsCmd.command('make').aliases(['m', 'mk'])
  makeCmd.command('all').action(() => {
    setupOutputDir()
    Object.values(plugins).forEach((fn) => fn())
  })
  Object.entries(plugins).forEach(([name, fn]) => {
    makeCmd.addCommand(
      new Command(name).action(async () => {
        setupOutputDir()
        fn()
      }),
    )
  })

  requirementsCmd
    .command('list-plugins')
    .aliases(['l', 'ls', 'lp'])
    .action(() => {
      console.log('Available plugins to generate requirements files:')
      Object.keys(plugins).map((plugin) => {
        console.log(`  * ${plugin}`)
      })
    })
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function addTestCasesCommand(cmd: Command, plugins: Plugins) {
  const testCasesCmd = cmd.command('test-cases').aliases(['t', 'tc', 'tests'])

  testCasesCmd
    .command('generate')
    .aliases(['g', 'gen'])
    .option('-d, --dry-run', 'Dry run', false)
    .action((options) => {
      const isDryRun = options.dryRun as boolean
      const requirements = loadRequirements(constants.outputRequirementsPath)
      const {sets, generation} = loadConfig(constants.configPath)
      sets.forEach((set) => {
        const {filters, dimensions} = set
        generateTestCases({
          requirements,
          dimensions,
          filters,
          generation,
          outputDirectory: constants.outputTestCasePath,
          isDryRun,
        })
      })
    })

  testCasesCmd
    .command('markup')
    .aliases(['m', 'mk', 'mup'])
    .addOption(
      new Option('--format <ext>', 'the file format to markup to')
        .choices(Object.keys(markupPlugins))
        .default('md'),
    )
    .action((options) => {
      if (markupPlugins[options.format]) {
        markupPlugins[options.format](options)
      } else {
        throw new Error(`Unknown markup format: ${options.format}`)
      }
    })
}

const name = 'tc-maker'
const version = '1.0.0'

program
  .name(name)
  .version(version)
  .showHelpAfterError('(add --help for additional information)')
  .showSuggestionAfterError(true)
  .allowExcessArguments(false)

addRequirementsCommand(program, requirementsGeneratorPlugins)
addTestCasesCommand(program, requirementsGeneratorPlugins)

program.command('upload')

program.parse(process.argv)
