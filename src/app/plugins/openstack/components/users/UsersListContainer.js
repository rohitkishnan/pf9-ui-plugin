import React from 'react'
import { connect } from 'react-redux'

import ListTable from '../common/ListTable'

const mapStateToProps = state => {
  const { users } = state.openstack
  return {
    users: users.users,
  }
}

const options = {}

const columns = [
  { id: 'name', label: 'Name' },
  { id: 'displayname', label: 'Display Name' },
  { id: 'email', label: 'E-mail' },
]

export class UsersListContainer extends React.Component {
  render () {
    const { users } = this.props

    return (
      <ListTable
        title="Users"
        options={options}
        columns={columns}
        data={users}
      />
    )
  }
}

export default connect(mapStateToProps)(UsersListContainer)
