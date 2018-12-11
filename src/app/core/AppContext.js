import React from 'react'
import PropTypes from 'prop-types'
import { assocPath, flatten } from 'ramda'

const Context = React.createContext({})
export const Consumer = Context.Consumer
export const Provider = Context.Provider

class AppContext extends React.Component {
  state = {
    ...this.props.initialContext,

    session: {},

    initSession: async (unscopedToken, username) => {
      return this.state.setContext({
        session: {
          unscopedToken,
          username,
          loginSuccessful: true
        }
      })
    },

    updateSession: async (path, value) => {
      return this.state.setContext(
        assocPath(flatten(['session', path]), value)
      )
    },

    destroySession: async () => {
      return this.state.setContext({
        session: {}
      })
    },

    setContext: (...args) => {
      // If the `setState` async callback is not passed in default to
      // return a Promise.
      return new Promise((resolve, reject) => {
        if (args.length > 1) {
          // The Promise will never resolve when a callback is passed
          // but that's ok, because we are using the callback not an await.
          return this.setState(...args)
        }
        setImmediate(() => { window.context = this.state })
        this.setState(...args, resolve)
      })
    },
  }

  componentDidMount () {
    // For debugging and development convenience
    window.context = this.state
    window.setContext = this.state.setContext
  }

  render () {
    return (
      <Provider value={this.state}>
        {this.props.children}
      </Provider>
    )
  }
}

AppContext.propTypes = {
  initialContext: PropTypes.object
}

AppContext.defaultProps = {
  initialContext: {}
}

export const withAppContext = Component => props =>
  <Consumer>
    {
      ({ setContext, initSession, updateSession, destroySession, ...rest }) =>
        <Component
          {...props}
          initSession={initSession}
          updateSession={updateSession}
          destroySession={destroySession}
          setContext={setContext}
          context={rest}
        />
    }
  </Consumer>

export default AppContext
