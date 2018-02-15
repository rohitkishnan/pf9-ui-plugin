import Session from '../session'

function mockResponse (data, headers = {}) {
  const headersObj = { get: key => headers[key] }
  return Promise.resolve({
    ...data,
    headers: headersObj,
  })
}

const identity = x => x

describe('signIn', () => {
  it('gets an unscoped token', () => {
    const mockKeystone = {
      getUnscopedToken: jest.fn((username, password) => {
        expect(username).toEqual('test@platform9.com')
        expect(password).toEqual('secret')
        return mockResponse({}, { 'x-subject-token': 'secretToken' })
      })
    }
    const session = Session(mockKeystone)
    const mockDispatch = jest.fn(identity)
    const promise = session.signIn('test@platform9.com', 'secret')(mockDispatch)
    expect(mockKeystone.getUnscopedToken.mock.calls[0]).toEqual(['test@platform9.com', 'secret'])
    return promise
  })
})
