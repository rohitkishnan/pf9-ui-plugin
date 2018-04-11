import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import UsersList from './UsersList'

const mapStateToProps = state => {
  const { users } = state.openstack
  return {
    users: users.users,
  }
}

@withRouter
@connect(mapStateToProps)
class UsersListContainer extends React.Component {
  redirectToAdd = () => {
    this.props.history.push('/users/add')
  }

  render () {
    const { users } = this.props

    return (
      <UsersList users={users} onAdd={this.redirectToAdd} />
    )
  }
}

export default UsersListContainer
