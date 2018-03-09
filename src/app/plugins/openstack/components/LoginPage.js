import React from 'react'
import { connect } from 'react-redux'
import Button from 'material-ui/Button'
import Session from '../actions/session'

function mapStateToProps (state, ownProps) {
  return {
    errors: (state.errors && state.errors.login) || []
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

  renderErrors = () => {
    const { errors } = this.props
    if (errors.length === 0) {
      return null
    }
    return (
      <div className="error-message">
        {errors.map((error, idx) => (
          <div key={idx} className="error-message">{error}</div>
        ))}
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
        {this.renderErrors()}
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
