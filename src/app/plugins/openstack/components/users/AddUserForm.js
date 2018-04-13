import React from 'react'
import PropTypes from 'prop-types'
import NoAutofillHack from 'core/common/NoAutofillHack'
import TextField from 'material-ui/TextField'
import Button from 'material-ui/Button'

class AddUserForm extends React.Component {
  state = {
    name: '',
    displayname: '',
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
    this.props.onSubmit(this.state)
  }

  render () {
    return (
      <form noValidate>
        <NoAutofillHack />
        {this.fields.map(this.renderField)}
        <div>
          <Button variant="raised" onClick={this.handleSubmit}>Submit</Button>
        </div>
      </form>
    )
  }
}

AddUserForm.propTypes = {
  onSubmit: PropTypes.func.isRequired
}

export default AddUserForm
