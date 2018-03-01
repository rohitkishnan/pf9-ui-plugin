import { mockResponse } from '../../util/testUtils'

import {
  // getScopedProjects,
  getUnscopedToken,
} from '../keystone'

let originalFetch = global.fetch

describe('keystone api', () => {
  beforeEach(() => {
    global.fetch = require('jest-fetch-mock')
  })

  afterAll(() => {
    global.fetch = originalFetch
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
})
