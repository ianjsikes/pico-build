// import boxen from 'boxen';
import chalk from 'chalk';
import blessed from 'blessed';
// import logUpdate from 'log-update';
// import windowSize from 'window-size';

// const boxenOpts = {
//   padding: 1,
//   margin: 1,
//   borderColor: 'green',
// };

const screen = blessed.screen({ smartCSR: true });
screen.title = 'PICO-BUILD';

let lines = [];
// const boxHeight = 13;

// const Layout = blessed.layout({
//   parent: screen,
//   top: 0,
//   left: 0,
//   width: '100%',
//   height: '100%',
//   border: 'line',
//   style: { border: { fg: 'blue' } },
// });
screen.on('mousewheel', () => {
  console.log('mousewheel');
});

const LogBox = blessed.box({
  parent: screen,
  style: { bg: 'purple' },
  content: '',
  scrollable: true,
  // alwaysScroll: true,
  scrollbar: { style: { bg: 'yellow' }, track: { bg: 'gray' } },
  padding: 1,
  keys: true,
  mouse: true,
  label: chalk.yellow.bold('Log'),
  valign: 'bottom',
  // bottom: 2,
  left: 1,
  bottom: 10,
  // position: { bottom: 1, left: 1 },
  height: 'shrink',
  border: { type: 'line' },
  style: { border: { fg: 'yellow' } },
});
// LogBox.enableMouse();
// LogBox.on('scroll', () => {
//   LogBox.insertLine(0, 'Clicked!');
//   screen.render();
// });
LogBox.focus();
// screen.append(LogBox);

const DoneBox = blessed.box({
  parent: screen,
  // position: { bottom: 1, left: 1 },
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
// screen.append(DoneBox);
screen.key(['escape', 'q', 'C-c'], () => process.exit(0));

// const instructionsBox = boxen(
//   `${chalk.green.bold('Done!')}\n${chalk.white(
//     new Date().toLocaleTimeString()
//   )}\n\n» Press ${chalk.yellow.bold('q')} to ${chalk.underline(
//     'q'
//   )}uit.\n» Press ${chalk.yellow.bold('b')} to manually ${chalk.underline(
//     'b'
//   )}uild.\n» Press ${chalk.yellow.bold('o')} to ${chalk.underline(
//     'o'
//   )}pen cart in PICO-8.`,
//   boxenOpts
// );

export const render = () => {
  // let outputLines = [...lines];
  // if (lines.length < windowSize.height - boxHeight) {
  //   const numPadRows = windowSize.height - boxHeight - lines.length;
  //   for (let i = 0; i < numPadRows; i++) {
  //     outputLines.unshift('');
  //   }
  // }
  LogBox.setContent(lines.join('\n'));
  LogBox.setScrollPerc(100);

  // logUpdate(`${outputLines.join('\n')}\n${instructionsBox}`);
  // process.stdout.write(
  // differ.update(`${outputLines.join('\n')}\n${instructionsBox}`)
  // );
  screen.render();
};

export const log = (...text) => {
  lines.push(text.join(''));
  render();
};
export const clear = () => (lines = []);
