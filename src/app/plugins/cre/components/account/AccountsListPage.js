import React from 'react'
import createCRUDComponents from 'core/helpers/createCRUDComponents'
import accountActions, { creAccountsCacheKey } from './actions'

const AccountListPage = () => {
  const options = {
    addUrl: '/ui/cre/account/add',
    addText: 'Add Account',
    uniqueIdentifier: 'account_id',
    columns: [
      { id: 'account_id', label: 'Account Name' },
      { id: 'credentials.aws_access_key_id', label: 'Access Key ID' },
      { id: 'credentials.aws_secret_access_key', label: 'Secret Access Key' },
    ],
    cacheKey: creAccountsCacheKey,
    loaderFn: accountActions.listFn,
    name: 'CreAccounts',
    title: 'Accounts',
    deleteFn: accountActions.deleteFn,
    editUrl: '/ui/cre/account/edit'
  }
  const { ListPage } = createCRUDComponents(options)

  return <ListPage />
}

export default AccountListPage
