import fs from 'fs';
import path from 'path';

const getTitleComment = (filename) => {
  let name = filename.split('.')[0]
  if (/^[0-9]\./.test(filename)) {
    name = filename.split('.')[1]
  }

  if (!name) return null

  name = name.replace('-', ' ')
  return `--${name}`
}

export default function build(config) {
  const startTime = Date.now();
  const stats = {};

  let luaFilePaths = fs
    .readdirSync(config.sourceDir)
    .filter(file => file.endsWith('.lua'));

  stats.numLuaFiles = luaFilePaths.length;
  stats.luaFiles = [];

  let sources = luaFilePaths.map(filePath => {
    stats.luaFiles.push({
      name: filePath,
      path: path.join(config.sourceDir, filePath),
    });

    let content = fs.readFileSync(path.join(config.sourceDir, filePath), 'utf8');
    if (!content.startsWith('--')) {
      let comment = getTitleComment(filePath)
      if (comment) {
        content = `${comment}\n${content}`
      }
    }
    return content;
  });

  let luaSource = sources.join('\n-->8\n');

  stats.outputFile = { name: path.basename(config.cartPath), path: config.cartPath };
  if (fs.existsSync(config.cartPath)) {
    stats.outputFileExists = true;
    let cart = fs.readFileSync(config.cartPath, 'utf8');
    let [pre, ...rest] = cart.split('__lua__');
    let [_, ...moreRest] = rest.join('').split('__gfx__');
    let outputArr = [pre, '__lua__\n', luaSource, '__gfx__', ...moreRest];
    let newCartSource = outputArr.join('');
    fs.writeFileSync(config.cartPath, newCartSource);
  } else {
    stats.outputFileExists = false;
    let pre = `pico-8 cartridge // http://www.pico-8.com\nversion 16\n__lua__\n`;
    let cartSource = pre + luaSource;
    fs.writeFileSync(config.cartPath, cartSource);
  }

  const endTime = Date.now();
  stats.runTime = endTime - startTime;

  return stats;
}
