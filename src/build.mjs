import fs from 'fs';
import path from 'path';

export default function build(argv) {
  const startTime = Date.now();
  const stats = {};

  let luaFilePaths = fs
    .readdirSync(argv.input)
    .filter(file => file.endsWith('.lua'));

  stats.numLuaFiles = luaFilePaths.length;
  stats.luaFiles = [];

  let sources = luaFilePaths.map(filePath => {
    stats.luaFiles.push({
      name: filePath,
      path: path.join(argv.input, filePath),
    });

    let content = fs.readFileSync(path.join(argv.input, filePath), 'utf8');
    if (!content.startsWith('--')) {
      content = `--${filePath.replace('.lua', '')}\n${content}`;
    }
    return content;
  });

  let luaSource = sources.join('\n-->8\n');

  stats.outputFile = { name: path.basename(argv.output), path: argv.output };
  if (fs.existsSync(argv.output)) {
    stats.outputFileExists = true;
    let cart = fs.readFileSync(argv.output, 'utf8');
    let [pre, ...rest] = cart.split('__lua__');
    let [_, ...moreRest] = rest.join('').split('__gfx__');
    let outputArr = [pre, '__lua__\n', luaSource, '__gfx__', ...moreRest];
    let newCartSource = outputArr.join('');
    fs.writeFileSync(argv.output, newCartSource);
  } else {
    stats.outputFileExists = false;
    let pre = `pico-8 cartridge // http://www.pico-8.com\nversion 16\n__lua__\n`;
    let cartSource = pre + luaSource;
    fs.writeFileSync(argv.output, cartSource);
  }

  const endTime = Date.now();
  stats.runTime = endTime - startTime;

  return stats;
}
