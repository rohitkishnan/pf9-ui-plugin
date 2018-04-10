import React from 'react'
import { connect } from 'react-redux'
import { addUser } from '../../actions/users'
import AddUserForm from './AddUserForm'

const mapStateToProps = state => ({})

@connect(mapStateToProps)
class AddUserPage extends React.Component {
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
        <h1>Add Users Page</h1>
        <AddUserForm onSubmit={this.handleSubmit} />
      </div>
    )
  }
}

export default AddUserPage
