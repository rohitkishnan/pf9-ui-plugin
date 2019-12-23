import React from 'react'
import SubmitButton from 'core/components/SubmitButton'
import TextField from 'core/components/validatedForm/TextField'
import ValidatedForm from 'core/components/validatedForm/ValidatedForm'
import createUpdateComponents from 'core/helpers/createUpdateComponents'
import { creAccountsCacheKey } from './actions'

class ModifyAccountForm extends React.PureComponent {
  state = this.props.initialValues

  handleSubmit = data => {
    this.props.onComplete(data)
  }

  render () {
    return (
      <ValidatedForm initialValues={this.props.initialValues} onSubmit={this.handleSubmit}>
        <TextField id="account_id" label="Account Name" required disabled />
        <TextField id="aws_access_key_id" label="Access Key ID" required />
        <TextField id="aws_secret_access_key" label="Secret Access Key" required />
        <SubmitButton>Update Account</SubmitButton>
      </ValidatedForm>
    )
  }
}

export const options = {
  FormComponent: ModifyAccountForm,
  uniqueIdentifier: 'account_id',
  cacheKey: creAccountsCacheKey,
  listUrl: '/ui/cre/account',
  name: 'UpdateAccountDetails',
  title: 'Update Account Details'
}

const { UpdatePage } = createUpdateComponents(options)

export default UpdatePage
