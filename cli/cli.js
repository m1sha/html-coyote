#!/usr/bin/env node
const {run} = require("../dist")
require('yargs')
    .scriptName("coyo")
    .usage('Usage: $0 ')
    .command('init [name]', 'init the lines in a file', (yargs) => {
        yargs.positional('name', {
          type: 'string',
          default: 'Cambi',
          describe: 'the name to say hello to'
        })
      }, argv=>{
        console.log( argv.name)
        console.log( argv.s)
    })
    .command("run", "run build the site assembly", argv=>{
        run()
    })
    .example('$0 init ', 'init the lines in the given file')
    .help('h')
    .alias('h', 'help')
    .argv;



