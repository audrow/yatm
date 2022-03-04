import {program} from 'commander'

program
  .name('my-program')
  .version('1.0.0')
  .showHelpAfterError('(add --help for additional information)')
  .showSuggestionAfterError(true)
  .allowExcessArguments(false)
  .option('-d, --debug', 'output extra debugging')
  .option('-s, --small', 'small pizza size')
  .option('-p, --pizza-type <type>', 'flavour of pizza')

program
  .command('clone')
  .argument('<source>', 'source location')
  .argument('[destination]', 'destination for the cloned repo')
  .description('clone a repository into a newly created directory')
  .option('-u, --username <username>', 'git username for the new repository')
  .action((source, destination) => {
    console.log('clone command called', source, destination)
  })

const add = program.command('add')
add.command('stash')
const next = add.command('next')

const newCommands = ['foo', 'bar', 'baz']
for (const command of newCommands) {
  next.command(command)
}

program.parse(process.argv)

const options = program.opts()
console.log(options)
// if (options.debug) console.log(options);
// console.log('pizza details:');
// if (options.small) console.log('- small pizza size');
// if (options.pizzaType) console.log(`- ${options.pizzaType}`);
