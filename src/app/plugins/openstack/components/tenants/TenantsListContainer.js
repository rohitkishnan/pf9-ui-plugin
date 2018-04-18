/* eslint-disable react/prop-types */
import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import ConfirmationDialog from 'core/common/ConfirmationDialog'
import ListTable from 'core/common/ListTable'

const mapStateToProps = state => {
  const { tenants } = state.openstack
  return {
    tenants: tenants.tenants,
  }
}

const columns = [
  { id: 'name', label: 'Name' },
  { id: 'description', label: 'Description' },
  { id: 'computeUsage', label: 'Compute usage' },
  { id: 'blockStorageUsage', label: 'Block storage usage' },
  { id: 'networkUsage', label: 'Network usage' },
]

@withRouter
@connect(mapStateToProps)
class TenantsListContainer extends React.Component {
  state = {
    showConfirmation: false,
    tenantsToDelete: null,
  }

  redirectToAdd = () => {
    this.props.history.push('/tenants/add')
  }

  handleDelete = selectedIds => {
    this.setState({ showConfirmation: true })
    const selectedTenants = this.props.tenants.filter(tenant => selectedIds.includes(tenant.id))
    this.setState({ tenantsToDelete: selectedTenants })
  }

  handleDeleteCancel = () => {
    this.setState({ showConfirmation: false })
  }

  handleDeleteConfirm = () => {
    this.setState({ showConfirmation: false })
  }

  deleteConfirmText = () => {
    const { tenantsToDelete } = this.state
    if (!tenantsToDelete) {
      return
    }
    const tenantNames = tenantsToDelete.map(x => x.name).join(', ')
    return `This will permanently delete the following tenants(s): ${tenantNames}`
  }

  render () {
    const { tenants } = this.props

    return (
      <div>
        <ConfirmationDialog
          open={this.state.showConfirmation}
          text={this.deleteConfirmText()}
          onCancel={this.handleDeleteCancel}
          onConfirm={this.handleDeleteConfirm}
        />

        <ListTable
          title="Tenants"
          columns={columns}
          data={tenants}
          onAdd={this.redirectToAdd}
          onDelete={this.handleDelete}
        />
      </div>
    )
  }
}

export default TenantsListContainer
