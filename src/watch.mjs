import chokidar from 'chokidar';
import path from 'path';
import keypress from 'keypress';
import { spawn } from 'child_process';
import chalk from 'chalk';
import build from './build.mjs';
import { picoCmd, reloadCart } from './utils.mjs';
import Logger from './log.mjs';

let pico_process;
let logger;

const init = () => {
  keypress(process.stdin);
  process.on('close', () => {
    pico_process && pico_process.kill('SIGINT')
  })
}

const runBuild = config => {
  logger.clear();
  const stats = build(config);
  logger.log(`Found ${chalk.magenta.bold(stats.numLuaFiles)} lua files:`);
  stats.luaFiles.forEach(file => {
    logger.log(`   • ${chalk.magenta(file.name)}`);
  });
  if (stats.outputFileExists) {
    logger.log(
      `\nCopied into:\n   ${path.dirname(stats.outputFile.path)}${
        path.sep
      }${chalk.yellow(stats.outputFile.name)}\n`
    );
  } else {
    logger.log(
      `\nCreated new cart:\n   ${path.dirname(stats.outputFile.path)}${
        path.sep
      }${chalk.yellow(stats.outputFile.name)}\n`
    );
  }
  const time = new Date().toLocaleTimeString();
  logger.render();

  if (pico_process) {
    reloadCart(config.cartPath);
  }
};

const openCart = config => {
  let cmd = config.executable || picoCmd();

  if (cmd) {
    if (pico_process) {
      pico_process.kill('SIGINT');
      pico_process = undefined;
    }

    pico_process = spawn(cmd, ['-run', config.cartPath]);
    pico_process.stdout.setEncoding('utf8');
    pico_process.stdout.on('data', chunk => {
      logger.log(`${chalk.cyan('PICO-8:')} `, chunk.trim());
    });

    pico_process.on('close', code => {
      logger.log('Closed with code:', code);
      pico_process = undefined;
    });
  }
};

export default function watch(config) {
  init();
  logger = new Logger();
  // Run the initial build once
  runBuild(config);

  // Construct the watcher
  const luaGlob = path.join(config.sourceDir, '**.lua');
  const watcher = chokidar.watch(luaGlob, {});

  watcher.on('change', _ => runBuild(config));
  watcher.on('add', _ => runBuild(config));
  watcher.on('unlink', _ => runBuild(config));

  process.stdin.on('keypress', (ch, key) => {
    if (key.sequence === '\u0003' || key.name === 'q') {
      pico_process && pico_process.kill();
      process.exit();
    }

    switch (key.name) {
      case 'b':
        runBuild(config);
        break;
      case 'o':
        openCart(config);
        break;
      case 'x':
        pico_process && pico_process.kill();
        break;
    }
  });
  process.stdin.setRawMode(true);
  process.stdin.resume();
}
