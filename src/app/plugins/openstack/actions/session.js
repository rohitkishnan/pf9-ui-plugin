import Keystone from '../api/keystone'

import { getStorage, setStorage } from '../../../core/common/pf9-storage'

// redux flux actions
const setTenants = tenants => ({ type: 'SET_TENANTS', payload: tenants })
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
export const getPreferredRegion = (regions, lastRegion) => {
  return (lastRegion && regions.find(x => x.id === lastRegion.id)) || regions[0]
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
  const tenantStorageKey = username => `last-tenant-accessed-${username}`
  const getLastTenant = username => getStorage(tenantStorageKey) || 'service'
  const setLastTenant = (username, tenant) => ctx.setStorage(tenantStorageKey(username), tenant)

  const regionStorageKey = username => `last-region-accessed-${username}`
  const getLastRegion = username => getStorage(regionStorageKey(username))
  const setLastRegion = (username, tenant) => ctx.setStorage(regionStorageKey(username), tenant)

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
    const lastTenant = ctx.getLastTenant(username)
    const tenant = ctx.getPreferredTenant(tenants, lastTenant)
    setLastTenant(username, tenant.name)
    const response = await keystone.getScopedToken(tenant.id, unscopedToken)
    const { token: { user, roles }, scopedToken } = response

    // TODO: Do we need to do this at login time?  Can we push it to a component further down?
    const regions = await keystone.getRegions(unscopedToken)
    const lastRegion = ctx.getLastRegion(username)
    const region = ctx.getPreferredRegion(regions, lastRegion)
    setLastRegion(username, region)

    dispatch(ctx.setCurrentSession({
      region,
      roles,
      scopedToken,
      tenant,
      unscopedToken,
      user,
      username,
    }))
    dispatch(ctx.setTenants(tenants))
  }

  ctx = {
    authenticate,
    getLastRegion,
    getLastTenant,
    getPreferredRegion,
    getPreferredTenant,
    getTenants,
    keystone: Keystone,
    setCurrentSession,
    setStorage,
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
