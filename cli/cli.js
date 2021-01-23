#!/usr/bin/env node
const {run, createNew} = require("../dist")
require('yargs')
    .scriptName("coyo")
    .usage('Usage: $0 ')
    .example('$0 run ', 'runs the site')
    .command("new", "creates new site from default template", yargs=>{
        createNew()
    })
    .command("publish", "publishes the site", yargs=>{
      run(false, 0)
    })
    .command("run [port]", "runs the site on development server",
    (yargs) => {
      yargs.positional('name', {
        type: 'int',
        default: 7001,
        describe: 'default port: 7001'
      })
    },
    argv=>{
      run(true, argv.port)
    })
    .help('h')
    .alias('h', 'help')
    .argv;