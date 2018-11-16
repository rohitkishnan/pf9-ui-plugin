import React from 'react'
import createUpdateComponents from 'core/createUpdateComponents'
import SubmitButton from 'core/common/SubmitButton'
import ValidatedForm from 'core/common/validated_form/ValidatedForm'
import TextField from 'core/common/validated_form/TextField'
import { loadCloudProviders, updateCloudProvider } from './actions'

const AWSFields = () => (
  <React.Fragment>
    <TextField id="key" label="AWS Access Key ID" />
    <TextField id="secret" label="Secret Key" />
  </React.Fragment>
)

const OpenstackFields = () => (
  <React.Fragment>
    <TextField id="username" label="Username" />
    <TextField id="password" label="Password" />
  </React.Fragment>
)

export const UpdateCloudProviderForm = ({ onComplete, initialValue }) => (
  <ValidatedForm onSubmit={onComplete} initialValues={initialValue}>
    <TextField id="name" label="Name" />
    {initialValue.type === 'aws' && <AWSFields />}
    {initialValue.type === 'openstack' && <OpenstackFields />}
    <SubmitButton>Update Cloud Provider</SubmitButton>
  </ValidatedForm>
)

export const options = {
  FormComponent: UpdateCloudProviderForm,
  updateFn: updateCloudProvider,
  loaderFn: loadCloudProviders,
  listUrl: '/ui/kubernetes/infrastructure#cloudProviders',
  name: 'UpdateCloudProvider',
  title: 'Update Cloud Provider',
  uniqueIdentifier: 'uuid',
}

const { UpdatePage } = createUpdateComponents(options)

export default UpdatePage