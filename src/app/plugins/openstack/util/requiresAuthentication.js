import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

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
