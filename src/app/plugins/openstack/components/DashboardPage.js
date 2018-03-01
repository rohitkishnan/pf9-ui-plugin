import React from 'react'
import { connect } from 'react-redux'
import requiresAuthentication from '../util/requiresAuthentication'

function mapStateToProps (state, ownProps) {
  return {}
}

@requiresAuthentication
@connect(mapStateToProps)
class Dashboard extends React.Component {
  render () {
    return (
      <h1>This is the dashboard page</h1>
    )
  }
}

export default Dashboard
