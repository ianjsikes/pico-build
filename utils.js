const commandExists = require('command-exists').sync;
const os = require('os');
const path = require('path');
const { execSync } = require('child_process');
const fs = require('fs');
const boxen = require('boxen');
const boxenOpts = {
  padding: 1,
  margin: 1,
  borderColor: 'green',
  borderStyle: 'round',
};
const chalk = require('chalk');

const MAC_PATH = path.join(
  '/',
  'Applications',
  'PICO-8.app',
  'Contents',
  'MacOS',
  'pico8'
);
const WIN_PATH = path.join('C:', 'Program Files (x86)', 'PICO-8', 'pico8.exe');

exports.picoCmd = () => {
  if (process.env.PICO8) {
    return process.env.PICO8;
  }

  if (commandExists('pico8')) {
    return 'pico8';
  }

  if (os.platform() === 'darwin' && fs.existsSync(MAC_PATH)) {
    return MAC_PATH;
  }

  if (os.platform() === 'win32' && fs.existsSync(WIN_PATH)) {
    return WIN_PATH;
  }

  console.log(
    `${chalk.bold.red('ERROR:')} Unable to find ${chalk.bold.green(
      'pico8'
    )} executable file.`
  );
  console.log(
    `To enable launching carts, set the ${chalk.cyan(
      '$PICO8'
    )} environment variable or the ${chalk.cyan(
      '--executable'
    )} option to the location of your ${chalk.bold.green(
      'pico8'
    )} executable.\n`
  );
  return;
};

exports.runApplescript = (...scripts) =>
  execSync(`osascript ${scripts.map(x => `-e '${x}'`).join(' ')}`);

const activate = 'tell application "PICO-8" to activate';
const loadCart = cart =>
  `tell application "System Events"
key code 53
"load ${cart}"
key code 36
delay .1
key code 15 using control down
end tell`;

exports.reloadCart = cart =>
  exports.runApplescript(activate, 'delay .3', loadCart(cart));
