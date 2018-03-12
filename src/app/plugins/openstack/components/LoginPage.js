import React from 'react'
import { connect } from 'react-redux'
import Button from 'material-ui/Button'
import Session from '../actions/session'

function mapStateToProps (state, ownProps) {
  const { login } = state.openstack
  const { startLogin, loginSucceeded, loginFailed } = login
  return {
    startLogin,
    loginSucceeded,
    loginFailed,
  }
}

export class LoginPage extends React.Component {
  state = {
    username: '',
    password: '',
  }

  updateValue = key => event => {
    this.setState({ [key]: event.target.value })
  }

  performLogin = () => {
    const { username, password } = this.state
    const { dispatch } = this.props
    const session = Session()
    dispatch(session.signIn({ username, password }))
  }

  renderStatus = () => {
    const { startLogin, loginSucceeded, loginFailed } = this.props
    return (
      <div className="error-message">
        {startLogin && <div className="login-start">Attempting login...</div>}
        {loginSucceeded && <div className="login-succeeded">Successfully logged in.</div>}
        {loginFailed && <div className="login-failed">Login attempt failed.</div>}
      </div>
    )
  }

  renderHeader = () => (
    <div style={{ backgroundColor: '#4aa3df', width: '200px', padding: '0 2rem' }}>
      <img src="/logo.png" style={{ width: '200px' }} />
    </div>
  )

  renderFooter = () => (
    // TODO
    null
  )

  render () {
    const { username, password } = this.state

    return (
      <div className="login-page">
        {this.renderHeader()}
        {this.renderStatus()}
        <h2>Please sign in</h2>
        <div><input type="text" value={username} onChange={this.updateValue('username')} /></div>
        <div><input type="password" value={password} onChange={this.updateValue('password')} /></div>
        <div><Button color="primary" variant="raised" onClick={this.performLogin}>Log in</Button></div>
        {this.renderFooter()}
      </div>
    )
  }
}

export default connect(mapStateToProps)(LoginPage)
