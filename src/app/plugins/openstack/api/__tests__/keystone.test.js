import { mockResponse } from '../../util/testUtils'

import {
  // getScopedProjects,
  constructPasswordMethod,
  constructTokenBody,
  getScopedProjects,
  getScopedToken,
  getUnscopedToken,
} from '../keystone'

import * as registry from '../../../../util/registry'

let originalFetch = global.fetch

describe('keystone api', () => {
  beforeEach(() => {
    global.fetch = require('jest-fetch-mock')
  })

  afterAll(() => {
    global.fetch = originalFetch
  })

  describe('constructors', () => {
    it('constructTokenBody', () => {
      const tokenConstructor = constructTokenBody('token')
      expect(tokenConstructor('serviceTenantId', 'secretUnscopedToken')).toEqual({
        auth: {
          identity: {
            methods: ['token'],
            token: { id: 'secretUnscopedToken' },
          },
          scope: { project: { id: 'serviceTenantId' } }
        }
      })
    })

    it('constructPasswordMethod', () => {
      const result = constructPasswordMethod('pf9@platform9.com', 'secret')
      expect(result).toEqual({
        user: {
          name: 'pf9@platform9.com',
          domain: { id: 'default' },
          password: 'secret'
        }
      })
    })
  })

  describe('getUnscopedToken', () => {
    it('uses the username and password in the request', async () => {
      const mockedFetch = jest.fn(() => mockResponse())
      global.fetch = mockedFetch
      await getUnscopedToken('pf9@platform9.com', 'secret')
      const [ url, params ] = mockedFetch.mock.calls[0]
      const body = JSON.parse(params.body)
      expect(url).toEqual('/keystone/v3/auth/tokens?nocatalog')
      expect(body.auth.identity.password.user.name).toEqual('pf9@platform9.com')
      expect(body.auth.identity.password.user.password).toEqual('secret')
    })

    it('returns the X-Subject-Token when the password is correct', async () => {
      global.fetch = jest.fn(() =>
        mockResponse({ headers: { 'X-Subject-Token': 'secretToken' } })
      )
      const unscopedToken = await getUnscopedToken('pf9@platform9.com', 'secret')
      expect(unscopedToken).toEqual('secretToken')
    })

    it('returns the X-Subject-Token to be null when the password is bad', async () => {
      global.fetch = jest.fn(() =>
        mockResponse({ headers: {} })
      )
      const unscopedToken = await getUnscopedToken('pf9@platform9.com', 'badPassword')
      expect(unscopedToken).toBeFalsy()
    })
  })

  describe('getScopedProjects', () => {
    let mockedFetch
    const mockedTenants = [
      { id: 'abc123', name: 'serviceTenantId', description: 'Service tenant' }
    ]

    beforeEach(() => {
      registry.setItem('token', 'secretUnscopedToken')
      mockedFetch = jest.fn(() => mockResponse({ projects: mockedTenants }))
      global.fetch = mockedFetch
    })

    it('uses the unscopedToken', async () => {
      await getScopedProjects()
      expect(mockedFetch).toHaveBeenCalledWith(
        '/keystone/v3/auth/projects',
        {
          method: 'GET',
          headers: { 'X-Auth-Token': 'secretUnscopedToken' }
        }
      )
    })

    it('returns the projects', async () => {
      const tenants = await getScopedProjects()
      expect(tenants).toEqual(mockedTenants)
    })
  })

  // Not implemented yet
  describe.skip('getScopedToken', () => {
    it('uses the existing unscopedToken to get a token scoped to a tenant', async () => {
      registry.setItem('token', 'secretUnscopedToken')
      const mockedFetch = jest.fn(() => mockResponse())
      global.fetch = mockedFetch
      await getScopedToken('serviceTenantId')
    })

    it('returns a different X-Subject-Token that is scoped to a tenant', async () => {
    })
  })
})
