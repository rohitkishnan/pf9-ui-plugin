import React from 'react'
import { connect } from 'react-redux'
import { addFlavor } from '../../actions/flavors'
import AddFlavorForm from './AddFlavorForm'

const mapStateToProps = state => ({})

@connect(mapStateToProps)
class AddFlavorPage extends React.Component {
  handleSubmit = () => {
    try {
      this.props.dispatch(addFlavor(this.state))
    } catch (err) {
      console.error(err)
    }
  }

  render () {
    return (
      <div>
        <h1>Add Flavors Page</h1>
        <AddFlavorForm onSubmit={this.handleSubmit} />
      </div>
    )
  }
}

export default AddFlavorPage
