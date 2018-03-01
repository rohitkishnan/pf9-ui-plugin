require('isomorphic-fetch')

const config = require('../../config')
const registry = require('../../src/app/util/registry')

const keystone = require('../../src/app/plugins/openstack/api/keystone')
const {
  getUnscopedToken,
} = keystone

describe('keystone', () => {
  beforeAll(() => {
    registry.setupFromConfig(config)
  })

  describe('setup config variables', () => {
    it('should have the host set', () => {
      expect(registry.getItem('host')).toBeDefined()
    })

    it('should have the username set', () => {
      expect(registry.getItem('username')).toBeDefined()
    })

    it('should have the password set', () => {
      expect(registry.getItem('password')).toBeDefined()
    })
  })

  describe('getUnscopedToken', () => {
    it('it returns the correct token', async () => {
      const { username, password } = registry.getInstance()
      const token = await getUnscopedToken(username, password)
      expect(token).toBeDefined()
    })

    it('it returns null when there is an invalid login', async () => {
      const { username } = registry.getInstance()
      const password = 'bad-password'
      const token = await getUnscopedToken(username, password)
      expect(token).toBeNull()
    })
  })
})
