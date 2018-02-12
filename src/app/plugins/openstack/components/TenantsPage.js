import React from 'react'
import requiresAuthentication from '../util/requiresAuthentication'
import { connect } from 'react-redux'

function mapStateToProps (state, ownProps) {
  return {
  }
}

@requiresAuthentication
@connect(mapStateToProps)
class TenantsPage extends React.Component {
  render () {
    return (
      <div>
        <h1>Tenants Page</h1>
      </div>
    )
  }
}

export default TenantsPage
