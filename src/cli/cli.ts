import {Option, program} from 'commander'
import {join} from 'path'
import generateRequirementsPlugins from './generate-requirements-plugins'
import markupPlugins from './markup-plugins'

const name = 'tc-maker'
const version = '1.0.0'
const generatedDirName = 'generated-files'

program
  .name(name)
  .version(version)
  .showHelpAfterError('(add --help for additional information)')
  .showSuggestionAfterError(true)
  .allowExcessArguments(false)

const requirementsCmd = program.command('requirements').aliases(['r', 'req'])

requirementsCmd
  .command('generate')
  .aliases(['g', 'gen'])
  .addOption(
    new Option('--generator <generator>', 'generator to use')
      .choices(['all', ...Object.keys(generateRequirementsPlugins)])
      .default('all'),
  )
  .option(
    '-o, --output <dir>',
    'the output location of the generated files',
    String,
    join(generatedDirName, 'requirements'),
  )
  .option(
    '-r, --requirements-dir <dir>',
    'directory with requirements files',
    String,
    '.',
  )
  .action((options) => {
    console.log('generate requirements command called with path:', options)
  })

const testCasesCmd = program.command('test-cases').aliases(['t', 'tc', 'tests'])

testCasesCmd
  .command('generate')
  .aliases(['g', 'gen'])
  .option(
    '-o, --output <dir>',
    'the output location of the generated files',
    String,
    join(generatedDirName, 'test-cases'),
  )
  .option(
    '-r, --requirements-dir <dir>',
    'directory with requirements files',
    String,
    '.',
  )
  .action((options) => {
    console.log('generate test cases command called with path:', options)
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

program.command('upload')

program.parse(process.argv)
