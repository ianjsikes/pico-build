const chokidar = require('chokidar');
const path = require('path');
const keypress = require('keypress');
const boxen = require('boxen');
const { spawn } = require('child_process');
const boxenOpts = {
  padding: 1,
  margin: 1,
  borderColor: 'green',
  borderStyle: 'round',
};
const chalk = require('chalk');
const build = require('./build.js');
const { picoCmd, reloadCart } = require('./utils.js');
keypress(process.stdin);

let pico_process;

const clearConsole = () => process.stdout.write('\033c');

const runBuild = argv => {
  clearConsole();
  const stats = build(argv);
  console.log(`Found ${chalk.magenta.bold(stats.numLuaFiles)} lua files:`);
  stats.luaFiles.forEach(file => {
    console.log(`   • ${chalk.magenta(file.name)}`);
  });
  if (stats.outputFileExists) {
    console.log(
      `\nCopied into:\n   ${path.dirname(stats.outputFile.path)}${
        path.sep
      }${chalk.yellow(stats.outputFile.name)}`
    );
  } else {
    console.log(
      `\nCreated new cart:\n   ${path.dirname(stats.outputFile.path)}${
        path.sep
      }${chalk.yellow(stats.outputFile.name)}`
    );
  }
  const time = new Date().toLocaleTimeString();
  const msg = `${chalk.green.bold('Done!')}\n${chalk.white(
    time
  )}\n\n» Press ${chalk.yellow.bold('q')} to ${chalk.underline(
    'q'
  )}uit.\n» Press ${chalk.yellow.bold('b')} to manually ${chalk.underline(
    'b'
  )}uild.\n» Press ${chalk.yellow.bold('o')} to ${chalk.underline(
    'o'
  )}pen cart in PICO-8.`;
  console.log(boxen(msg, boxenOpts));

  if (pico_process) {
    reloadCart();
  }
};

const openCart = argv => {
  let cmd = argv.executable || picoCmd();

  if (cmd) {
    if (pico_process) {
      pico_process.kill('SIGINT');
      pico_process = undefined;
    }

    pico_process = spawn(cmd, ['-run', argv.output]);
    pico_process.stdout.setEncoding('utf8');
    pico_process.stdout.on('data', chunk => {
      console.log('PICO8:', chunk);
    });

    pico_process.on('close', code => {
      console.log('Closed with code:', code);
      pico_process = undefined;
    });
  }
};

exports.watch = function(argv) {
  // Run the initial build once
  runBuild(argv);

  // Construct the watcher
  const luaGlob = path.join(argv.input, '**.lua');
  const watcher = chokidar.watch(luaGlob, {});

  watcher.on('change', _ => runBuild(argv));
  watcher.on('add', _ => runBuild(argv));
  watcher.on('unlink', _ => runBuild(argv));

  process.stdin.on('keypress', (ch, key) => {
    if (key.sequence === '\u0003' || key.name === 'q') {
      process.exit();
    }

    switch (key.name) {
      case 'b':
        runBuild(argv);
        break;
      case 'o':
        openCart(argv);
        break;
    }
  });
  process.stdin.setRawMode(true);
  process.stdin.resume();
};
