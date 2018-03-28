/* eslint-disable react/prop-types */
import React from 'react'
import { connect } from 'react-redux'

import ListTable from '../common/ListTable'

const mapStateToProps = state => {
  const { tenants } = state.openstack
  return {
    tenants: tenants.tenants,
  }
}

const options = {}

const columns = [
  { id: 'name', label: 'Name' },
  { id: 'description', label: 'Description' },
  { id: 'computeUsage', label: 'Compute usage' },
  { id: 'blockStorageUsage', label: 'Block storage usage' },
  { id: 'networkUsage', label: 'Network usage' },
]

export class TenantsListContainer extends React.Component {
  render () {
    const { tenants } = this.props

    return (
      <ListTable
        title="Tenants"
        options={options}
        columns={columns}
        data={tenants}
      />
    )
  }
}

export default connect(mapStateToProps)(TenantsListContainer)
