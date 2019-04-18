# pico-build
An all-purpose command-line tool for building PICO-8 games. Write your game as multiple lua files, and have them compiled into tabs within your `.p8` cart.

## Quickstart
```
$ npm i -g pico-build
$ mkdir my-game && cd my-game
$ pico-build init
$ pico-build build --watch
```

## Installation
To install `pico-build`, you will need either [npm](https://www.npmjs.com/get-npm) or [yarn](https://yarnpkg.com/lang/en/docs/install/).
```
$ npm install --global pico-build
```
or
```
$ yarn global add pico-build
```

## Usage

### `build`
```
$ pico-build build --src ./src --cart ./my-cart.p8 --watch
```
Builds the lua files in `./src` into a cart named `my-cart.p8`.

#### Options
- `--src` / `-s` - The folder containing your lua files. It will concatenate these files in order alphabetically. I recommend naming them '0.foo.lua', '1.bar.lua', '2.baz.lua', etc. The files will be separated into tabs within the PICO-8 editor.
- `--cart` / `-c` - The output cart file. If the file does not exist, it will create one. If it does exist, it will replace the code in the cart and leave the rest of it untouched.
- `--watch` / `-w` - Enables watch mode. Will automatically rebuild the cart when any of the lua files change. From watch mode, you can open PICO-8, and (on MacOS) the game will automatically reload on rebuilds.
- `--executable` / `-e` - The path to your `pico-8` executable file. `pico-build` will try finding this on its own, but you can specify it if it is not in the standard place for your OS.

### `extract`
```
$ pico-build extract --src ./src --cart ./my-cart.p8
```
Extracts the code from `my-cart.p8` into lua files in `./src`. If the code in the cart contains tabs, each tab will be extracted into its own file.

### `init`
```
$ pico-build init
```
Creates a starter PICO-8 project in the current folder. `pico-build` will prompt you for the game's name, version, description, and author name. It will create the following files:
- `pico.toml` - The config file for the project. The `pico.toml` format is described below.
- `[game-name].p8` - The PICO-8 cart for your game.
- `src/0.init.lua` - The entry point for your lua code.

## Config File
`pico-build` can read from a configuration file so you don't have to specify every option in the command line. It will search for either `pico.toml` (using [toml](https://learnxinyminutes.com/docs/toml/)) or `pico.json`. The following properties are supported:
- `src_dir` [string] - The folder containing lua files
- `cart` [string] - The path to your `.p8` file
- `watch` [boolean] - Enables watch mode
- `open_pico` [boolean] - Opens your cart in PICO-8 on build
- `executable` [string] - The path to your `pico-8` executable
- `name` [string] - The name of your game. Currently unused.
- `description` [string] - The subtitle of your game. Currently unused.
- `version` [string] - The version of your game (ex: '1.0.0')
- `author` [string] - The name of the game's author(s)

Here is an simple example config file:
```toml
# pico.toml
src_dir = 'src'
cart = 'my_game.p8'
watch = false
open_pico = true
```
