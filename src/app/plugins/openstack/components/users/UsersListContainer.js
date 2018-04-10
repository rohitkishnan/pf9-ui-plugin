import React from 'react'
import { connect } from 'react-redux'

import UsersList from './UsersList'

const mapStateToProps = state => {
  const { users } = state.openstack
  return {
    users: users.users,
  }
}

@connect(mapStateToProps)
class UsersListContainer extends React.Component {
  render () {
    const { users } = this.props

    return (
      <UsersList users={users} />
    )
  }
}

export default UsersListContainer
