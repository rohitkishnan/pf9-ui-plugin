import React from 'react'
import createCRUDComponents from 'core/helpers/createCRUDComponents'
import accountActions, { creAccountsCacheKey } from '../account/actions'

const RecommendationPage = () => {
  const options = {
    cacheKey: creAccountsCacheKey,
    uniqueIdentifier: 'account_id',
    columns: [
      { id: 'account_id', label: 'Account Name' },
      { id: 'credentials.aws_access_key_id', label: 'Access Key ID' },
      { id: 'credentials.aws_secret_access_key', label: 'Secret Access Key' }
    ],
    loaderFn: accountActions.listFn,
    multiSelection: false,
    deleteFn: null
  }

  const { ListPage } = createCRUDComponents(options)

  return <ListPage />
}

export default RecommendationPage
