import { identity } from './fp'

export function mockResponse (params) {
  const { headers = {}, ...rest } = params
  const headersObj = { get: key => headers[key] }
  return Promise.resolve({
    ...rest,
    headers: headersObj,
  })
}

export const mockDispatch = jest.fn(identity)
