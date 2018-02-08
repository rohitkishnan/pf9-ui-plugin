import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import App from './App'

const initialState = {}

const reducer = (state = initialState, action) => {
  const { type, payload } = action // eslint-disable-line no-unused-vars
  switch (type) {
    default:
      return state
  }
}

const store = createStore(
  reducer,
  applyMiddleware(thunk)
)

const render = Component => {
  ReactDOM.render(
    <Provider store={store}>
      <AppContainer>
        <Component />
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
