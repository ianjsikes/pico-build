const chokidar = require('chokidar');
const path = require('path');
const keypress = require('keypress');
const boxen = require('boxen');
const boxenOpts = {
  padding: 1,
  margin: 1,
  borderColor: 'green',
  borderStyle: 'round',
};
const chalk = require('chalk');
const build = require('./build.js');
keypress(process.stdin);

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
};

module.exports = function(argv) {
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
        console.log('rebuilding!');
        runBuild(argv);
        break;
      case 'o':
        console.log('Opening PICO-8!');
        break;
    }
  });
  process.stdin.setRawMode(true);
  process.stdin.resume();
};
