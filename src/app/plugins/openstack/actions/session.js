import {
  getRegions,
  getScopedProjects,
  getScopedToken,
  getUnscopedToken,
} from '../api/keystone'

import { pluck } from '../util/fp'

import { getStorage, setStorage } from '../../../core/common/pf9-storage'
import { toaster } from '../util'

// redux flux actions
const setUserTenants = tenants => ({ type: 'SET_USER_TENANTS', payload: tenants })
const setUnscopedToken = token => ({ type: 'SET_UNSCOPED_TOKEN', payload: token })
const setUsername = username => ({ type: 'SET_USERNAME', payload: username })
const setCurrentSession = ({ tenant, user, scopedToken, roles }) => {
  return { type: 'SET_CURRENT_SESSION', payload: { tenant, user, scopedToken, roles } }
}

// Figure out which tenant to make the current tenant
const getPreferredTenant = (tenants, lastTenant) =>
  (tenants.find(x => (x.name === lastTenant) && x.name !== 'admin') || tenants[0])

const initiateNewSession = (unscopedToken, username) => async (dispatch, getState) => {
  // Save out unscopedToken and username to redux store
  dispatch(setUnscopedToken(unscopedToken))
  dispatch(setUsername(username))

  // Get list of tenants
  const tenants = await getScopedProjects()
  const userTenants = tenants.projects || []
  if (userTenants.length === 0) {
    return toaster.error(`No tenant found for ${username}`)
  }
  dispatch(setUserTenants(userTenants))

  // Choose a tenant
  const lastTenant = getStorage(`last-tenant-accessed-${username}`) || 'service'
  const tenant = getPreferredTenant(userTenants, lastTenant)

  // TODO: Do we need to do this at login time?  Can we push it to a component further down?
  const regions = await getRegions()
  const lastRegion = getStorage(`last-region-accessed-${username}`)
  const regionIds = regions.map(pluck('id'))
  const currentRegion = (lastRegion && regionIds.includes(lastRegion.id)) || regions[0]
  setStorage('currentRegion', currentRegion)

  // Get a scopedToken for a tenant
  const { headers, token } = await getScopedToken(tenant.id, unscopedToken)
  const scopedToken = headers.get('x-subject-token')
  if (!scopedToken) {
    return toaster.error('Unable to get scoped token')
  }
  const { roles, user } = token
  dispatch(setCurrentSession({ tenant, user, scopedToken, roles }))
}

export const signIn = (username, password, mfa) => async dispatch => {
  if (mfa) {
    password = password + mfa
  }
  console.log(`Attempting sign in with ${username} / ${password}`)
  const response = await getUnscopedToken(username, password)
  const unscopedToken = response.headers.get('x-subject-token')

  return dispatch(initiateNewSession(unscopedToken, username))
}
