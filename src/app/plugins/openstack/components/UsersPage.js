import React from 'react'
import requiresAuthentication from '../util/requiresAuthentication'
import { connect } from 'react-redux'
import { fetchUsers } from '../actions/users'

import Loader from 'core/common/Loader'
import UsersListContainer from './users/UsersListContainer'

function mapStateToProps (state, ownProps) {
  const { users } = state.openstack
  return {
    usersLoaded: users.usersLoaded,
  }
}

@requiresAuthentication
@connect(mapStateToProps)
class UsersPage extends React.Component {
  componentDidMount () {
    // Load the users if they don't already exist
    if (!this.props.usersLoaded) {
      this.props.dispatch(fetchUsers())
    }
  }
  render () {
    const { usersLoaded } = this.props
    return (
      <div>
        <h1>Users Page</h1>
        {!usersLoaded && <Loader />}
        {usersLoaded && <UsersListContainer />}
      </div>
    )
  }
}

export default UsersPage
