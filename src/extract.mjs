import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';
import Jimp from 'jimp';

import decodePng from './decode-png.mjs';

const getTabName = (tab, index) => {
  let firstLine = tab.trim().split('\n')[0].trim()
  if (firstLine.startsWith('--')) {
    let tabName = firstLine.slice(2).trim().replace(/([^a-z0-9]+)/gi, '-')
    if (tabName) {
      return `${index}.${tabName}.lua`
    }
  }
  return `${index}.lua`
}

export default async function extract(config) {
  try {
    const startTime = Date.now();
    const stats = {};
    let cartSrc;

    if (config.cartPath.endsWith('.p8.png')) {
      const img = await Jimp.read(config.cartPath)
      cartSrc = decodePng(img);
    } else {
      cartSrc = fs.readFileSync(config.cartPath, 'utf8')
    }

    let code = cartSrc.split('__lua__')[1].split('__gfx__')[0]
    let tabs = code.split('-->8\n')

    stats.numLuaFiles = tabs.length
    stats.luaFiles = [];

    if (!fs.existsSync(config.sourceDir)) {
      mkdirp.sync(config.sourceDir)
    }

    tabs.forEach((tab, index) => {
      let name = getTabName(tab, index)
      let filePath = path.join(config.sourceDir, name)
      fs.writeFileSync(filePath, tab)

      stats.luaFiles.push({ name, path: filePath })
    })

    const endTime = Date.now();
    stats.runTime = endTime - startTime;

    return stats;
  } catch (err) {
    console.log(err)
  }
}
