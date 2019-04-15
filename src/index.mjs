#!/usr/bin/env node --experimental-modules --no-warnings

import chalk from 'chalk';
import yargs from 'yargs';

import watch from './watch.mjs';
import build from './build.mjs';
import extract from './extract.mjs';
import Config from './config.mjs';

// process.stdin.setEncoding('ascii');
// process.stdin.on('data', chunk => console.log(chunk));

const argv = yargs
  .usage('Usage: $0 <command> [options]')
  .command(
    'build',
    'Build lua file(s) into a PICO-8 cart',
    yargs => {
      yargs
        .option('src', {
          alias: 's',
          nargs: 1,
          describe: 'Path to folder containing lua files',
          type: 'string',
        })
        .option('cart', {
          alias: 'c',
          nargs: 1,
          describe: 'Path to output .p8 file',
          type: 'string',
        })
        .option('executable', {
          alias: 'e',
          type: 'string',
          describe: `Path to ${chalk.bold.green('pico8')} executable file`,
        })
        .option('watch', {
          alias: 'w',
          type: 'boolean',
          describe:
            'Runs the command in watch mode, re-running when a lua file changes',
        });
    },
    argv => {
      const config = new Config(argv)
      config.watch ? watch(config) : build(config)
    }
  )
  .command(
    'extract',
    'Extract code from PICO-8 cart into lua file(s)',
    yargs => {
      yargs
      .option('cart', { alias: 'c', nargs: 1, describe: 'Path to input .p8 file', type: 'string' })
      .option('src', { alias: 's', nargs: 1, describe: 'Path to output folder', type: 'string', default: '.' })
    },
    argv => {
      const config = new Config(argv)
      extract(config)
    }
  )
  .demandCommand(1)
  .example(
    '$0 build -i src -o my-cart.p8',
    'Compile all lua files in src/ into my-cart.p8'
  )
  .help('h')
  .alias('h', 'help')
  .version()
  .epilog('Copyright Ian J Sikes 2019').argv;
