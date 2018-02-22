import Keystone, {
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

const setTenants = tenants => ({ type: 'SET_TENANTS', payload: tenants })

// Figure out which tenant to make the current tenant
export const getPreferredTenant = (tenants, lastTenant) => {
  const notAdmin = x => x.name !== 'admin'
  return tenants.find(x => (x.name === lastTenant) && notAdmin(x)) || tenants.find(notAdmin) || tenants[0]
}
export const getPreferredRegion = (regions, lastRegion) => {
  const regionIds = regions.map(pluck('id'))
  return (lastRegion && regionIds.includes(lastRegion.id)) || regions[0]
}

const initiateNewSession = (unscopedToken, username) => async (dispatch, getState) => {

  // Get a scopedToken for a tenant
  const { headers, token } = await getScopedToken(tenant.id, unscopedToken)
  const scopedToken = headers.get('x-subject-token')
  if (!scopedToken) {
    return toaster.error('Unable to get scoped token')
  }
  const { roles, user } = token
  dispatch(setCurrentSession({ tenant, user, scopedToken, roles }))
}

const Session = (keystone = Keystone, mocks = {}) => {
  // This context stores methods that we might want to override in tests.
  let ctx

  const authenticate = async ({ username, password, mfa }) => {
    if (mfa) {
      password = password + mfa
    }
    return keystone.getUnscopedToken({ username, password })
  }

  const getTenants = unscopedToken => keystone.getScopedProjects()
  const getLastTenant = username => getStorage(`last-tenant-accessed-${username}`) || 'service'
  const getLastRegion = username => getStorage(`last-region-accessed-${username}`)

  const signIn = ({ username, password, mfa }) => async dispatch => {
    // Authenticate the user
    const unscopedToken = await ctx.authenticate({ username, password, mfa })
    if (!unscopedToken) {
      return
    }

    ctx.setUnscopedToken(unscopedToken)
    ctx.setUsername(username)

    // Figure out and set the default tenant based on previous usage.
    const tenants = await keystone.getScopedProjects(unscopedToken)
    const lastTenant = ctx.getLastTenant()
    const tenant = ctx.getPreferredTenant(tenants, lastTenant)
    const scopedToken = await keystone.getScopedToken(unscopedToken, tenant)

    // TODO: Do we need to do this at login time?  Can we push it to a component further down?
    const regions = await keystone.getRegions(unscopedToken)
    const lastRegion = ctx.getLastRegion(`last-region-accessed-${username}`)
    const regionIds = regions.map(pluck('id'))
    const currentRegion = ctx.getPreferredRegion(regions, lastRegion)
    // setStorage('currentRegion', currentRegion)
    /*
    const scopedTenant = await getScopedToken(unscopedToken, tenant)
    return dispatch(_setUsername(username))
    */

    dispatch(ctx.setCurrentSession({ username, unscopedToken, tenant, scopedToken }))
    dispatch(ctx.setTenants(tenants))
  }

  ctx = {
    authenticate,
    getLastRegion,
    getLastTenant,
    getPreferredRegion,
    getPreferredTenant,
    getScopedToken,
    getTenants,
    keystone: Keystone,
    setCurrentSession,
    setTenants,
    setUnscopedToken,
    setUsername,
    signIn,
    ...mocks // allow tests to override any of the above functions
  }

  return {
    signIn,
    authenticate,
  }
}

export default Session
