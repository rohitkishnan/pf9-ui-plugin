import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'

import createStorybookListener from 'storybook-addon-redux-listener'

const reducer = (state={}, action) => state
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
let middlewares = [ thunk ]

if (process.env.NODE_ENV === 'storybook') {
  const reduxListener = createStorybookListener()
  middlewares.push(reduxListener)
}

const store = createStore(
  reducer,
  composeEnhancers(
    applyMiddleware(middlewares)
  )
)

export default store
