import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

// import { getStorage } from '../../../core/common/pf9-storage'

// Wraps a component class to make it require authentication.
const requiresAuthentication = WrappedComponent => {
  const mapState = state => ({ session: state.openstack.session })

  return (
    @withRouter
    @connect(mapState)
    class AuthenticatedComponent extends React.Component {
      componentDidMount () {
        const { session, history } = this.props
        if (!(session && session.user)) {
          // Check first to see if there is a session we can recover from LocalStorage
          // Otherwise force the user to log in
          history.push('/login')
        }
      }
      render () {
        return (
          <WrappedComponent {...this.props} />
        )
      }
    }
  )
}

export default requiresAuthentication
