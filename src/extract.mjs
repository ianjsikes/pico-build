import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';
import Jimp from 'jimp';
import _ from 'lodash';

import decodePng from './decode-png.mjs';
import P8Cart from './p8-cart.mjs';

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

    let cart = P8Cart.fromCartSource(cartSrc);

    stats.numLuaFiles = cart.tabs.length
    stats.luaFiles = [];

    if (!fs.existsSync(config.sourceDir)) {
      mkdirp.sync(config.sourceDir)
    }

    cart.tabs.forEach((tab, index) => {
      let name = tab.title ?
        `${index}.${_.kebabCase(tab.title)}.lua` :
        `${index}.lua`;
      
      let filePath = path.join(config.sourceDir, name)
      fs.writeFileSync(filePath, tab.code)

      stats.luaFiles.push({ name, path: filePath })
    })

    const endTime = Date.now();
    stats.runTime = endTime - startTime;

    return stats;
  } catch (err) {
    console.log(err)
  }
}
