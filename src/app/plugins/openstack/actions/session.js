import Keystone, {
  getRegions,
  getScopedProjects,
  getScopedToken,
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
export const getPreferredTenant = (tenants, lastTenant) => {
  const notAdmin = x => x.name !== 'admin'
  return tenants.find(x => (x.name === lastTenant) && notAdmin(x)) || tenants.find(notAdmin) || tenants[0]
}

export const getLastTenant = (username, _getStorage = getStorage) => getStorage(`last-tenant-accessed-${username}`) || 'service'

const initiateNewSession = (unscopedToken, username) => async (dispatch, getState) => {
  // Get list of tenants
  const tenants = await getScopedProjects()
  const userTenants = tenants.projects || []
  if (userTenants.length === 0) {
    return toaster.error(`No tenant found for ${username}`)
  }
  dispatch(setUserTenants(userTenants))

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

const Session = (keystone = Keystone, dependencyOverrides = {}) => {
  let context = {
    setUnscopedToken,
    setUsername,
  }

  const authenticate = async ({ username, password, mfa }) => {
    if (mfa) {
      password = password + mfa
    }
    return keystone.getUnscopedToken({ username, password })
  }
  context.authenticate = authenticate

  const signIn = ({
    username,
    password,
    mfa,
    ctx = context,
  }) => async dispatch => {
    const unscopedToken = await ctx.authenticate({ username, password, mfa })
    ctx.setUnscopedToken(unscopedToken)
    ctx.setUsername(username)
    // const tenants = await ctx.getTenants(unscopedToken)

    // Choose a tenant
    // const lastTenant = getLastTenant(username)
    // const tenant = getPreferredTenant(userTenants, lastTenant)

    /*
    const regions = await getRegions(unscopedToken)
    const scopedTenant = await getScopedToken(unscopedToken, tenant)
    dispatch(_setUnscopedToken(unscopedToken))
    return dispatch(_setUsername(username))
    */
  }
  context.signIn = signIn

  const mockContext = mocks => {
    context = { ...context, ...mocks }
  }

  return {
    signIn,
    authenticate,
    mockContext,
  }
}

export default Session
