import fs from 'fs';
import path from 'path';

import P8Cart from './p8-cart.mjs';

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
    .filter(file => file.endsWith('.lua'))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));


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
  stats.outputFileExists = fs.existsSync(config.cartPath)
  
  let cart = stats.outputFileExists ?
    P8Cart.fromCartSource(fs.readFileSync(config.cartPath, 'utf8')) :
    new P8Cart();
  cart.rawLua = luaSource;
  fs.writeFileSync(config.cartPath, cart.toCartSource());

  const endTime = Date.now();
  stats.runTime = endTime - startTime;

  return stats;
}
