import Session, { getPreferredTenant } from '../session'
import { mockDispatch } from '../../util/testUtils'

describe('getPreferredTenant', () => {
  const tenants = [
    { id: 1, name: 'admin' },
    { id: 2, name: 'foo' },
    { id: 3, name: 'service' },
    { id: 4, name: 'another' }
  ]

  it('should get the preferred tenant if it exists', () => {
    expect(getPreferredTenant(tenants, 'another').name).toBe('another')
  })

  it('should get the first non-admin tenant if the perferred does not exist', () => {
    expect(getPreferredTenant(tenants, 'non-existant tenant').name).toBe('foo')
  })

  it('should only return the admin network if it is the only one', () => {
    expect(getPreferredTenant([{ id: 1, name: 'admin' }], 'another').name).toBe('admin')
  })
})

describe('signIn', () => {
  it('gets an unscoped token', async () => {
    const mockKeystone = {
      getUnscopedToken: jest.fn().mockResolvedValue('secretToken')
    }
    const session = Session(mockKeystone)
    await session.signIn({ username: 'test@platform9.com', password: 'secret' })(mockDispatch)
    expect(mockKeystone.getUnscopedToken.mock.calls[0]).toEqual([{ username: 'test@platform9.com', password: 'secret' }])
  })

  it.only('kicks off the rest of the initiation procress', async () => {
    const mockKeystone = {
      getUnscopedToken: jest.fn().mockResolvedValue('secretToken')
    }

    const session = Session(mockKeystone)
    const mockSession = {
      setUnscopedToken: jest.fn(),
      setUsername: jest.fn()
    }
    session.mockContext(mockSession)

    await session.signIn({ username: 'test@platform9.com', password: 'secret' })(mockDispatch)
    expect(mockSession.setUnscopedToken.mock.calls[0][0]).toEqual('secretToken')
    expect(mockSession.setUsername.mock.calls[0][0]).toEqual('test@platform9.com')
  })
})
