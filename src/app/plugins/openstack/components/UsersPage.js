import React from 'react'
import requiresAuthentication from '../util/requiresAuthentication'
import { connect } from 'react-redux'

import UsersListContainer from './users/UsersListContainer'

function mapStateToProps (state, ownProps) {
  const { users } = state.openstack
  return {
    usersLoaded: users.usersLoaded,
  }
}

const Loader = () => <div>Loading...</div>

@requiresAuthentication
@connect(mapStateToProps)
class UsersPage extends React.Component {
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
