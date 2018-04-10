import React from 'react'
import PropTypes from 'prop-types'

import ListTable from '../common/ListTable'

const columns = [
  { id: 'name', label: 'Username' },
  { id: 'displayname', label: 'Display name' },
  { id: 'mfa', label: 'Two-factor authentication' },
  { id: 'tenants', label: 'Tenants' },
]

class UsersList extends React.Component {
  render () {
    const { onAdd, users } = this.props

    if (!users || users.length === 0) {
      return (<h1>No users found</h1>)
    }

    return (
      <ListTable
        title="Users"
        columns={columns}
        data={users}
        onAdd={onAdd}
      />
    )
  }
}

UsersList.propTypes = {
  /** List of users [{ name, displayname, tenants, ... }] */
  users: PropTypes.array.isRequired,

  /** What to do when the add button is clicked */
  onAdd: PropTypes.func.isRequired,
}

UsersList.defaultProps = {
  users: [],
}

export default UsersList
