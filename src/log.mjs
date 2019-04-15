import chalk from 'chalk';
import blessed from 'blessed';

const screen = blessed.screen({ smartCSR: true });
screen.title = 'PICO-BUILD';

let lines = [];

const LogBox = blessed.box({
  parent: screen,
  style: { bg: 'purple' },
  content: '',
  scrollable: true,
  scrollbar: { style: { bg: 'yellow' }, track: { bg: 'gray' } },
  padding: 1,
  keys: true,
  mouse: true,
  label: chalk.yellow.bold('Log'),
  valign: 'bottom',
  left: 1,
  bottom: 10,
  height: 'shrink',
  width: '100%-2',
  border: { type: 'line' },
  style: { border: { fg: 'yellow' } },
});
LogBox.focus();

const DoneBox = blessed.box({
  parent: screen,
  bottom: 1,
  left: 1,
  width: 'shrink',
  height: 'shrink',
  label: chalk.green.bold('Done!'),
  border: { type: 'line' },
  padding: { left: 2, right: 2, top: 1, bottom: 1 },
  style: { border: { fg: 'green' } },
  content: `${chalk.white(
    new Date().toLocaleTimeString()
  )}\n\n» Press ${chalk.yellow.bold('q')} to ${chalk.underline(
    'q'
  )}uit.\n» Press ${chalk.yellow.bold('b')} to manually ${chalk.underline(
    'b'
  )}uild.\n» Press ${chalk.yellow.bold('o')} to ${chalk.underline(
    'o'
  )}pen cart in PICO-8.`,
});

screen.key(['escape', 'q', 'C-c'], () => process.exit(0));

export const render = () => {
  LogBox.setContent(lines.join('\n'));
  LogBox.setScrollPerc(100);

  screen.render();
};

export const log = (...text) => {
  lines.push(text.join(''));
  render();
};
export const clear = () => (lines = []);
