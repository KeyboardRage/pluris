let plugins;
const fs = require("fs");

/**
 * @param {import('eris')} Eris
 * @param {Object.<string, Boolean>} options
 */
module.exports = (Eris, options = {}) => {
  plugins = Object.fromEntries((fs.readdirSync(`${__dirname}/src`)).map((p) => [p, true]));
  const selectedPlugins = Object.keys(options);
  selectedPlugins.forEach((k) => {
    if (typeof plugins[k] === 'undefined') return console.error(`Unknown option: ${k}`);
    if (typeof options[k] !== 'boolean') throw new TypeError(`Expecting type boolean for option ${k}. Received type ${typeof options[k]}.`);
    plugins[k] = options[k];
  });

  let count = 0;
  Object.keys(plugins).forEach((k) => {
    if (plugins[k] === false) return;
    const plugin = require(`./src/${k}`);

    plugin.init(Eris, plugins);
    delete plugin.init;
    count += 1;
  });

  console.log(`Loaded ${count} pluris plugins`);
};
