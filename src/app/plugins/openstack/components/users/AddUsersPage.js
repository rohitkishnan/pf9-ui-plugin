import React from 'react'
import { connect } from 'react-redux'
import TextField from 'material-ui/TextField'
import Button from 'material-ui/Button'
import NoAutofillHack from '../common/NoAutofillHack'
import { addUser } from '../../actions/users'

const mapStateToProps = state => ({})

export class AddUsersPage extends React.Component {
  state = {
    email: '',
    username: '',
    displayName: '',
    password: '',
  }

  setField = field => event => this.setState({ [field]: event.target.value })

  fields = [
    { id: 'name', label: 'Username' },
    { id: 'displayname', label: 'Display Name' },
    { id: 'password', label: 'Password', type: 'password' },
  ]

  renderField = ({ id, label, type = 'text' }) => {
    if (type === 'text' || type === 'password') {
      return (
        <div key={id}>
          <TextField id={id} type={type} label={label} value={this.state[id]} onChange={this.setField(id)} />
        </div>
      )
    }
  }

  handleSubmit = () => {
    try {
      this.props.dispatch(addUser(this.state))
    } catch (err) {
      console.error(err)
    }
  }

  render () {
    return (
      <div>
        <h1>
          Add Users Page
        </h1>
        <form noValidate>
          <NoAutofillHack />
          {this.fields.map(this.renderField)}
          <div>
            <Button variant="raised" onClick={this.handleSubmit}>Submit</Button>
          </div>
        </form>
      </div>
    )
  }
}

export default connect(mapStateToProps)(AddUsersPage)
