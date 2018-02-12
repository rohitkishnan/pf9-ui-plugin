import React from 'react'
import { connect } from 'react-redux'
import Button from 'material-ui/Button'

function mapStateToProps (state, ownProps) {
  return {}
}

@connect(mapStateToProps)
class LoginPage extends React.Component {
  state = {
    username: '',
    password: '',
  }

  updateValue = key => event => {
    this.setState({ [key]: event.target.value })
  }

  performLogin = () => {
    const { username, password } = this.state
    console.log(`Attempting to login using ${username} / ${password}`)
  }

  render () {
    const { username, password } = this.state

    return (
      <div className="login-page">
        <div><input type="text" value={username} onChange={this.updateValue('username')} /></div>
        <div><input type="password" value={password} onChange={this.updateValue('password')} /></div>
        <div><Button color="primary" variant="raised" onClick={this.performLogin}>Log in</Button></div>
      </div>
    )
  }
}

export default LoginPage
