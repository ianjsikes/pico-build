import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';

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

export default function extract({ cart, dest }) {
  const startTime = Date.now();
  const stats = {};

  const cartSrc = fs.readFileSync(cart, 'utf8')
  let code = cartSrc.split('__lua__')[1].split('__gfx__')[0]
  let tabs = code.split('-->8\n')

  stats.numLuaFiles = tabs.length
  stats.luaFiles = [];

  if (!fs.existsSync(dest)) {
    mkdirp.sync(dest)
  }

  tabs.forEach((tab, index) => {
    let name = getTabName(tab, index)
    let filePath = path.join(dest, name)
    fs.writeFileSync(filePath, tab)

    stats.luaFiles.push({ name, path: filePath })
  })

  const endTime = Date.now();
  stats.runTime = endTime - startTime;

  return stats;
}
