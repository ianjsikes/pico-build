const fs = require('fs');
const path = require('path');

module.exports = function main(argv) {
  let luaFilePaths = fs
    .readdirSync(argv.input)
    .filter(file => file.endsWith('.lua'));

  let sources = luaFilePaths.map(filePath => {
    let content = fs.readFileSync(path.join(argv.input, filePath), 'utf8');
    if (!content.startsWith('--')) {
      content = `--${filePath.replace('.lua', '')}\n${content}`;
    }
    return content;
  });

  let luaSource = sources.join('\n-->8\n');

  if (fs.existsSync(argv.output)) {
    let cart = fs.readFileSync(argv.output, 'utf8');
    let [pre, ...rest] = cart.split('__lua__');
    let [_, ...moreRest] = rest.join('').split('__gfx__');
    let outputArr = [pre, '__lua__\n', luaSource, '__gfx__', ...moreRest];
    let newCartSource = outputArr.join('');
    fs.writeFileSync(argv.output, newCartSource);
  } else {
    let pre = `pico-8 cartridge // http://www.pico-8.com\nversion 16\n__lua__\n`;
    let cartSource = pre + luaSource;
    fs.writeFileSync(argv.output, cartSource);
  }
};
