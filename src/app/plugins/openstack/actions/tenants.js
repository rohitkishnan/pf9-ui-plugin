import {
  createTenant,
} from '../api/keystone'

export const ADD_TENANT = 'ADD_TENANT'
export const SET_TENANTS = 'SET_TENANTS'

export const setTenants = tenants => ({ type: SET_TENANTS, payload: tenants })

export const addTenant = tenant => async dispatch => {
  const tenantId = await createTenant(tenant)
  if (tenantId) {
    tenant.id = tenantId
    dispatch({ type: ADD_TENANT, payload: tenant })
  }
}
