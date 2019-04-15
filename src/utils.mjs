import commandExists from 'command-exists';
import os from 'os';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import chalk from 'chalk';

const MAC_PATH = path.join(
  '/',
  'Applications',
  'PICO-8.app',
  'Contents',
  'MacOS',
  'pico8'
);
const WIN_PATH = path.join('C:', 'Program Files (x86)', 'PICO-8', 'pico8.exe');

export const picoCmd = () => {
  if (process.env.PICO8) {
    return process.env.PICO8;
  }

  if (commandExists.sync('pico8')) {
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

export const runApplescript = (...scripts) =>
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

export const reloadCart = cart => {
  if (os.platform() === 'darwin') {
    runApplescript(activate, 'delay .3', loadCart(cart));
  } else {
    console.log(`Press ${chalk.yellow('Ctrl+R')} in PICO-8 to reload cart`);
  }
};
