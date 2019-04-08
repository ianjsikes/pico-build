#! /usr/bin/env node

const program = require('commander');
const fs = require('fs');
const path = require('path');

program
  .version('0.0.1')
  .option('-i, --input [folder]', 'The input folder')
  .option('-o --output [file]', 'The output file')
  .parse(process.argv);

async function main() {
  let luaFilePaths = fs
    .readdirSync(program.input)
    .filter(file => file.endsWith('.lua'));

  let sources = luaFilePaths.map(filePath => {
    let content = fs.readFileSync(path.join(program.input, filePath), 'utf8');
    if (!content.startsWith('--')) {
      content = `--${filePath.replace('.lua', '')}\n${content}`;
    }
    return content;
  });

  let luaSource = sources.join('\n-->8\n');

  if (fs.existsSync(program.output)) {
    let cart = fs.readFileSync(program.output, 'utf8');
    let [pre, ...rest] = cart.split('__lua__');
    let [_, ...moreRest] = rest.join('').split('__gfx__');
    let outputArr = [pre, '__lua__\n', luaSource, '__gfx__', ...moreRest];
    let newCartSource = outputArr.join('');
    fs.writeFileSync(program.output, newCartSource);
  } else {
    let pre = `pico-8 cartridge // http://www.pico-8.com\nversion 16\n__lua__\n`;
    let cartSource = pre + luaSource;
    fs.writeFileSync(program.output, cartSource);
  }
}

main();
console.log('✨  done!');
