// Storybook uses its own webpack.config.js that is independent of our
// main config.  It does provide a mechanism to extend it.
// Aliases have been added so we don't have to figure out the relative paths.

const path = require('path')

module.exports = {
  resolve: {
    alias: {
      core: path.resolve(__dirname, '../app/core'),
      openstack: path.resolve(__dirname, '../app/plugins/openstack')
    }
  }
}
