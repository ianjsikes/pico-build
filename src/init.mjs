import path from 'path';
import fs from 'fs';
import inquirer from 'inquirer';
import json2toml from 'json2toml';
import mkdirp from 'mkdirp';
import _ from 'lodash';
import P8Cart from './p8-cart.mjs';

const templateCode = (title, description) =>
`--${title}
${description ? `--${description}\n` : ''}
x=64
y=64

function _update()
 if (btn(0)) then x-=1 end
 if (btn(1)) then x+=1 end
 if (btn(2)) then y-=1 end
 if (btn(3)) then y+=1 end
end

function _draw()
 rectfill(0,0,127,127,5)
 circfill(x,y,7,14)
end
`

const questions = [
  {
    name: 'projectName',
    type: 'input',
    message: 'What is the name of your game?',
    default: () => path.basename(process.cwd()),
    validate: (input) => input.length > 0,
  },
  {
    name: 'version',
    type: 'input',
    default: '1.0.0'
  },
  {
    name: 'description',
    type: 'input'
  },
  {
    name: 'author',
    type: 'input'
  }
]

export default async function init() {
  const answers = await inquirer.prompt(questions)
  const picoConfig = {
    name: answers.projectName,
    description: answers.description,
    version: answers.version,
    author: answers.author,
    src_dir: 'src',
    cart: `${_.snakeCase(answers.projectName)}.p8`,
    watch: false,
    open_pico: true,
  }

  let title = picoConfig.name
  let subtitle = picoConfig.description ?
    picoConfig.description :
    (picoConfig.author ? `by ${picoConfig.author}` : '')

  let cart = new P8Cart()
  const code = templateCode(title, subtitle)
  cart.setTab(0, code, 'init')

  fs.writeFileSync('pico.toml', json2toml(picoConfig))
  mkdirp.sync('src')
  fs.writeFileSync('src/0.init.lua', cart.tabs[0].code)
  fs.writeFileSync(picoConfig.cart, cart.toCartSource())
}
