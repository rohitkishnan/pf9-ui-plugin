import React from 'react'
import requiresAuthentication from '../util/requiresAuthentication'
import { connect } from 'react-redux'

import Loader from 'core/common/Loader'
import TenantsListContainer from './tenants/TenantsListContainer'

function mapStateToProps (state, ownProps) {
  const { tenants } = state.openstack
  return {
    tenantsLoaded: tenants.tenantsLoaded,
  }
}

@requiresAuthentication
@connect(mapStateToProps)
class TenantsPage extends React.Component {
  render () {
    const { tenantsLoaded } = this.props
    return (
      <div>
        <h1>Tenants Page</h1>
        {!tenantsLoaded && <Loader />}
        {tenantsLoaded && <TenantsListContainer />}
      </div>
    )
  }
}

export default TenantsPage
