import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { Provider } from 'react-redux'
import App from './App'
import store from './store'

import plugins from './plugins'
import pluginManager from './core/pluginManager'
import PluginProvider from './core/PluginProvider'

plugins.forEach(plugin => plugin.registerPlugin(pluginManager))





// All these extra newlines should break the lint part of tests.

const render = Component => {
  ReactDOM.render(
    <Provider store={store}>
      <AppContainer>
        <PluginProvider pluginManager={pluginManager}>
          <Component />
        </PluginProvider>
      </AppContainer>
    </Provider>,
    document.getElementById('root')
  )
}

render(App)

if (module.hot) {
  module.hot.accept('./App.js', () => {
    setTimeout(() => {
      const NewApp = require('./App.js').default
      render(NewApp)
    }, 1)
  })
}
