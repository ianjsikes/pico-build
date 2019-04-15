import fs from 'fs'
import path from 'path'
import toml from 'toml'

export default class Config {
  constructor(args) {
    let rootDir = args.rootDir || '.'
    
    const tomlPath = path.join(rootDir, 'pico.toml')
    const jsonPath = path.join(rootDir, 'pico.json')

    let configObj = {}

    if (fs.existsSync(tomlPath)) {
      configObj = toml.parse(fs.readFileSync(tomlPath))
    } else if (fs.existsSync(jsonPath)) {
      configObj = JSON.parse(fs.readFileSync(jsonPath))
    } else {
      configObj = { error: "No config file found!" }
    }

    if ('src_dir' in configObj) this.sourceDir = configObj.src_dir
    if ('cart' in configObj) this.cartPath = configObj.cart
    if ('watch' in configObj) this.watch = configObj.watch
    if ('open_pico' in configObj) this.openPico = configObj.open_pico
    if ('executable' in configObj) this.executable = configObj.executable

    if ('src_dir' in args) this.sourceDir = args.src_dir
    if ('cart' in args) this.cartPath = args.cart
    if ('watch' in args) this.watch = args.watch
    if ('open_pico' in args) this.openPico = args.open_pico
    if ('executable' in args) this.executable = configObj.executable
  }
}
