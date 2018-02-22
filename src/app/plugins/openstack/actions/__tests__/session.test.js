import Session, { getPreferredTenant } from '../session'
import { lastCall, mockDispatch } from '../../util/testUtils'

const mockedTenants = [
  { id: 1, name: 'admin' },
  { id: 2, name: 'foo' },
  { id: 3, name: 'service' },
  { id: 4, name: 'another' }
]

const mockedRegions = [
]

describe('getPreferredTenant', () => {
  it('should get the preferred tenant if it exists', () => {
    expect(getPreferredTenant(mockedTenants, 'another').name).toBe('another')
  })

  it('should get the first non-admin tenant if the perferred does not exist', () => {
    expect(getPreferredTenant(mockedTenants, 'non-existant tenant').name).toBe('foo')
  })

  it('should only return the admin network if it is the only one', () => {
    expect(getPreferredTenant([{ id: 1, name: 'admin' }], 'another').name).toBe('admin')
  })
})

describe('getPreferredRegion', () => {
  it('TODO')
})

describe('signIn', () => {
  let mockKeystone
  let mockSession
  const selectedTenant = mockedTenants.find(x => x.name === 'another')

  beforeEach(() => {
    mockKeystone = {
      getUnscopedToken: jest.fn().mockResolvedValue('secretToken'),
      getScopedProjects: jest.fn().mockResolvedValue(mockedTenants),
      getScopedToken: jest.fn().mockResolvedValue('secretScopedToken'),
      getRegions: jest.fn().mockResolvedValue(mockedRegions)
    }
    mockSession = {
      setUnscopedToken: jest.fn(),
      setUsername: jest.fn(),
      getLastTenant: jest.fn().mockReturnValue('another'),
      getLastRegion: jest.fn().mockReturnValue('main'),
      getPreferredTenant: jest.fn().mockReturnValue(selectedTenant),
      setCurrentSession: jest.fn(),
      setTenants: jest.fn(),
    }
  })

  const performSignIn = () => {
    const session = Session(mockKeystone, mockSession)
    return session.signIn({ username: 'test@platform9.com', password: 'secret' })(mockDispatch)
  }

  it('gets an unscoped token', async () => {
    await performSignIn()
    expect(mockKeystone.getUnscopedToken).lastCalledWith({ username: 'test@platform9.com', password: 'secret' })
  })

  it('it sets some session variables', async () => {
    await performSignIn()
    expect(mockSession.setUnscopedToken).lastCalledWith('secretToken')
    expect(mockSession.setUsername).lastCalledWith('test@platform9.com')
  })

  it('choses a default tenant', async () => {
    await performSignIn()
    expect(mockKeystone.getScopedProjects).toHaveBeenCalled()
    expect(mockSession.getLastTenant).toHaveBeenCalled()
    expect(mockSession.getPreferredTenant).toHaveBeenCalled()
  })

  it('gets the scopedToken for the chosen tenant', async () => {
    await performSignIn()
    expect(mockKeystone.getScopedToken).toHaveBeenCalled()
    expect(lastCall(mockSession.setCurrentSession)[0]).toMatchObject({ scopedToken: 'secretScopedToken' })
  })

  it('sets the session and tenants', async () => {
    await performSignIn()
    expect(lastCall(mockSession.setCurrentSession)[0]).toMatchObject({ tenant: selectedTenant })
    expect(mockSession.setTenants).toHaveBeenCalledWith(mockedTenants)
  })

  it('chooses a default region', async () => {
    await performSignIn()
    expect(mockKeystone.getRegions).toHaveBeenCalled()
  })
})
