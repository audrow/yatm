import {Argument, Command, Option, program} from 'commander'
import fs from 'fs'
import {join} from 'path'
import sortObject from 'sort-object-keys'
import * as constants from '../constants'
import dbPlugins from '../plugins/db-plugins'
import requirementsGeneratorPlugins from '../plugins/requirements-generator-plugins'
import testCaseMarkupPlugins from '../plugins/test-case-markup-plugins'
import type DbPlugins from '../plugins/__types__/DbPlugins'
import type Plugins from '../plugins/__types__/Plugins'
import loadRequirements from '../requirements/utils/load-requirements'
import generateTestCases from '../test-cases/generator/generate-test-cases'
import loadConfig from '../test-cases/utils/load-config'
import loadTestCases from '../test-cases/utils/load-test-cases'
import printTestCases from '../test-cases/utils/print-test-cases'
import saveTestCases, {
  getTestCaseSaveFileName,
} from '../test-cases/utils/save-test-cases'
import sortTestCases from '../test-cases/utils/sort-test-cases'
import TestCase from '../test-cases/__types__/TestCase'
import clearDirectory from './utils/clear-directory'
import setupOutputDirectory from './utils/setup-output-directory'

function addRequirementsCommand(cmd: Command, plugins: Plugins) {
  plugins = sortObject(plugins)
  const requirementsCmd = cmd.command('requirements').aliases(['r', 'req'])

  const makeCmd = requirementsCmd.command('make').aliases(['m', 'mk'])
  makeCmd.command('all').action(() => {
    setupOutputDirectory()
    Object.values(plugins).forEach((fn) => fn())
  })
  Object.entries(plugins).forEach(([name, fn]) => {
    makeCmd.addCommand(
      new Command(name).action(async () => {
        setupOutputDirectory()
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

function addTestCasesCommand(cmd: Command, dbPlugins: DbPlugins) {
  const testCasesCmd = cmd.command('test-cases').aliases(['t', 'tc', 'tests'])

  testCasesCmd
    .command('make')
    .aliases(['m', 'mk'])
    .option('-d, --dry-run', 'Dry run', false)
    .action((options) => {
      const isDryRun = options.dryRun as boolean
      const requirements = loadRequirements(constants.OUTPUT_REQUIREMENTS_PATH)
      const {sets, generation} = loadConfig(constants.TEST_CASE_CONFIG)
      const testCaseSet = new Set<TestCase>()
      sets.forEach((set) => {
        const {filters, dimensions} = set
        generateTestCases({
          requirements,
          dimensions,
          filters,
          generation,
        }).forEach(testCaseSet.add, testCaseSet)
      })
      const testCases = Array.from(testCaseSet).sort(sortTestCases)
      if (isDryRun) {
        const message = printTestCases(testCases)
        console.log(message)
      } else {
        clearDirectory(constants.OUTPUT_TEST_CASE_PATH)
        saveTestCases(testCases, constants.OUTPUT_TEST_CASE_PATH)
      }
    })

  testCasesCmd
    .command('markup-preview')
    .aliases(['mup', 'markup'])
    .addOption(
      new Option('--format <ext>', 'the file format to markup to')
        .choices(Object.keys(testCaseMarkupPlugins))
        .default('md'),
    )
    .option('-d, --dry-run', 'Dry run', false)
    .action((options) => {
      const markupFn = testCaseMarkupPlugins[options.format]
      const isDryRun = options.dryRun as boolean
      if (!isDryRun) {
        clearDirectory(constants.OUTPUT_TEST_CASE_RENDER_PATH)
      }
      const testCases = loadTestCases(constants.OUTPUT_TEST_CASE_PATH)
      testCases.forEach(async (testCase) => {
        const text = await markupFn(testCase)
        if (isDryRun) {
          console.log(text)
        } else {
          const fileName = getTestCaseSaveFileName(testCase)
          fs.writeFileSync(
            join(
              constants.OUTPUT_TEST_CASE_RENDER_PATH,
              `${fileName}.${options.format}`,
            ),
            text,
          )
        }
      })
    })

  const dbCommand = testCasesCmd.command('db').alias('d')

  const regexArg = new Argument(
    '[regex]',
    'The regex to match test cases',
  ).default('.*')
  Object.entries(dbPlugins).forEach(([name, obj]) => {
    const command = new Command(name)

    command
      .command('create')
      .alias('c')
      .addArgument(regexArg)
      .action(obj.create)

    command.command('read').alias('r').addArgument(regexArg).action(obj.read)

    // command.command('update').alias('u').action(obj.update)

    command
      .command('delete')
      .alias('d')
      .addArgument(regexArg)
      .action(obj.delete)

    dbCommand.addCommand(command)
  })
  dbCommand
    .command('list-plugins')
    .aliases(['l', 'ls', 'lp'])
    .action(() => {
      console.log('Available database plugins:')
      Object.keys(dbPlugins).map((plugin) => {
        console.log(`  * ${plugin}`)
      })
    })
}

function addClearCommand(cmd: Command) {
  cmd
    .command('clear')
    .description(`Removes the generated directory '${constants.OUTPUT_PATH}'`)
    .action(() => {
      fs.rmSync(constants.OUTPUT_PATH, {recursive: true})
    })
}

const version = '1.0.0'
program
  .nameFromFilename(__filename)
  .version(version)
  .showHelpAfterError('(add --help for additional information)')
  .showSuggestionAfterError(true)
  .allowExcessArguments(false)

addRequirementsCommand(program, requirementsGeneratorPlugins)
addTestCasesCommand(program, dbPlugins)
addClearCommand(program)

program.command('upload')

program.parse(process.argv)
