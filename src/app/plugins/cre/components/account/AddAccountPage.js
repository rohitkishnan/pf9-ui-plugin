import React from 'react'
import ValidatedForm from 'core/components/validatedForm/ValidatedForm'
import TextField from 'core/components/validatedForm/TextField'
import SubmitButton from 'core/components/SubmitButton'
import createAddComponents from 'core/helpers/createAddComponents'
import { awsAccountCacheKey } from './actions'

export const AddAccountForm = ({ onComplete }) => {
  return (
    <ValidatedForm onSubmit={onComplete}>
      <TextField id="account_id" label="Account Name" required />
      <TextField id="aws_access_key_id" label="AWS Access Key ID" required />
      <TextField id="aws_secret_access_key" label="AWS Secret Access Key" required />
      <SubmitButton>Add Account</SubmitButton>
    </ValidatedForm>
  )
}

export const options = {
  cacheKey: awsAccountCacheKey,
  FormComponent: AddAccountForm,
  listUrl: '/ui/cre/account',
  name: 'AddAccount',
  title: 'Add Account',
  uniqueIdentifier: 'add_account'
}

const { AddPage } = createAddComponents(options)

export default AddPage
