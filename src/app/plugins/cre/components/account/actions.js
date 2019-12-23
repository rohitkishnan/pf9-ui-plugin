/* eslint-disable quote-props */
import ApiClient from 'api-client/ApiClient'
import createCRUDActions from 'core/helpers/createCRUDActions'
// import createContextLoader from 'core/helpers/createContextLoader'

const { cre } = ApiClient.getInstance()

export const creAccountsCacheKey = 'creAccounts'

const accountActions = createCRUDActions(creAccountsCacheKey, {
  listFn: async () => {
    return cre.listAccounts()
  },
  createFn: async (body) => {
    return cre.addAccount(body)
  },
  deleteFn: async (params) => {
    const body = { 'account_id': params.account_id, 'aws_access_key_id': params.credentials.aws_access_key_id, 'aws_secret_access_key': params.credentials.aws_secret_access_key }
    await cre.removeAccount(body)
  },
  updateFn: async (body) => {
    await cre.modifyAccount(body)
  },
  uniqueIdentifier: 'account_id'
})

export default accountActions
