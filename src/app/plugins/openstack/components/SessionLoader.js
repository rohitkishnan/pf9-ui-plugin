import React from 'react'
import { connect } from 'react-redux'

const mapStateToProps = (state, ownProps) => ({
})

@connect(mapStateToProps)
class SessionLoader extends React.Component {
  componentDidMount () {
    console.log('SessionLoader')
  }

  render = () => null
}

export default SessionLoader
