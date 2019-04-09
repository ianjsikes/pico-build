#! /usr/bin/env node

const argv = require('yargs')
  .usage('Usage: $0 <command> [options]')
  .command(
    'build',
    'Build lua file(s) into a PICO-8 cart',
    yargs => {
      yargs
        .option('input', {
          alias: 'i',
          nargs: 1,
          describe: 'Path to folder containing lua files',
          type: 'string',
          demandOption: true,
        })
        .option('output', {
          alias: 'o',
          nargs: 1,
          describe: 'Path to output .p8 file',
          type: 'string',
          demandOption: true,
        })
        .option('watch', {
          alias: 'w',
          type: 'boolean',
          describe:
            'Runs the command in watch mode, re-running when a lua file changes',
        });
    },
    argv => {
      if (argv.watch) {
        require('./watch.js')(argv);
      } else {
        console.log('...building cart');
        require('./build.js')(argv);
        console.log('✨  Done! ✨');
      }
    }
  )
  .example(
    '$0 build -i src -o my-cart.p8',
    'Compile all lua files in src/ into my-cart.p8'
  )
  .help('h')
  .alias('h', 'help')
  .version()
  .epilog('Copyright Ian J Sikes 2019').argv;
