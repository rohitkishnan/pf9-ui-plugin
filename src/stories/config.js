import 'babel-polyfill'
import { configure } from '@storybook/react'
import { setDefaults } from '@storybook/addon-info'

// Info plugin configuration
setDefaults({
  header: false,
  inline: true,
  source: true,
})

const req = require.context('.', true, /\.stories\.js$/)

function loadStories () {
  req.keys().forEach(filename => req(filename))
}

configure(loadStories, module)
