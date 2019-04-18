export default class P8Cart {
  constructor() {
    this.version = 16
    this.gfx = ''
    this.gff = ''
    this.label = ''
    this.map = ''
    this.sfx = ''
    this.music = ''
    this.tabs = []
    this.title = ''
    this.description = ''
  }

  get rawLua() {
    return this.tabs.map(({ code }) => code).join('\n-->8\n')
  }

  set rawLua(lua) {
    this.tabs = []
    if (!lua) {
      this.title = ''
      this.description = ''
      return
    }

    let luaLines = lua.trim().split('\n')
    if (luaLines[0].startsWith('--') && luaLines[1].startsWith('--')) {
      this.title = luaLines[0].slice(2)
      this.description = luaLines[1].slice(2)
    }

    let tabs = lua.trim().split('\n-->8\n').map(tab => tab.trim())
    for (const tab of tabs) {
      let title;
      if (tab.startsWith('--')) {
        title = tab.split('\n')[0].trim().slice(2).trim()
      }
      this.tabs.push({ title, code: tab })
    }
  }

  setTab(index, code, title) {
    this.tabs[index] = { title, code }
  }

  static fromCartSource(cart) {
    if (!cart.startsWith('pico-8 cartridge // http://www.pico-8.com\nversion')) {
      let err = new Error("Argument 'cart' is not a valid .p8 file")
      err.cart = cart
      throw err
    }

    let p8Cart = new P8Cart();
    let lines = cart.trim().split('\n')
    p8Cart.version = parseInt(lines[1].split(' ')[1])
    lines = lines.slice(2)

    let sectionHeaders = ['__lua__', '__gfx__', '__gff__', '__label__', '__map__', '__sfx__', '__music__']
    let sections = {}

    for (const sectionHeader of sectionHeaders) {
      if (lines[0] === sectionHeader) {
        lines = lines.slice(1)
        let nextSectionIndex = lines.findIndex(line => line.startsWith('__'))

        if (nextSectionIndex === -1) { // Last section
          const sectionData = lines.join('\n')
          sections[sectionHeader] = sectionData;
          break;
        }

        const sectionData = lines.slice(0, nextSectionIndex).join('\n')
        sections[sectionHeader] = sectionData;
        lines = lines.slice(nextSectionIndex);
      }
    }

    p8Cart.rawLua = sections.__lua__
    p8Cart.gfx = sections.__gfx__
    p8Cart.gff = sections.__gff__
    p8Cart.label = sections.__label__
    p8Cart.map = sections.__map__
    p8Cart.sfx = sections.__sfx__
    p8Cart.music = sections.__music__

    return p8Cart
  }

  toCartSource() {
    let src = `pico-8 cartridge // http://www.pico-8.com\nversion ${this.version}\n`
    if (this.tabs) src += `__lua__\n${this.rawLua}\n`
    if (this.gfx) src += `__gfx__\n${this.gfx}\n`
    if (this.gff) src += `__gff__\n${this.gff}\n`
    if (this.label) src += `__label__\n${this.label}\n`
    if (this.map) src += `__map__\n${this.map}\n`
    if (this.sfx) src += `__sfx__\n${this.sfx}\n`
    if (this.music) src += `__music__\n${this.music}\n`
    src += '\n'
    return src
  }  
}
