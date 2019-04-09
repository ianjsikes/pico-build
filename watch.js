const chokidar = require('chokidar');
const path = require('path');
const build = require('./build.js');

const clearConsole = () => process.stdout.write('\033c');

const runBuild = argv => {
  clearConsole();
  console.log('...building cart');
  build(argv);
  console.log('✨  Done! ✨');
};

module.exports = function(argv) {
  // Run the initial build once
  runBuild(argv);

  // Construct the watcher
  const luaGlob = path.join(argv.input, '**.lua');
  const watcher = chokidar.watch(luaGlob, {});

  watcher.on('change', _ => runBuild(argv));
  watcher.on('add', _ => runBuild(argv));
  watcher.on('unlink', _ => runBuild(argv));
};
