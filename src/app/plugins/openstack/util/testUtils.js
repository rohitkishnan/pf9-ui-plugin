import { identity } from './fp'

export function mockResponse (params) {
  const { headers = {}, ...rest } = params
  const headersObj = { get: key => headers[key] }
  return Promise.resolve({
    ...rest,
    headers: headersObj,
  })
}

export const lastCall = fn => fn.mock.calls[fn.mock.calls.length - 1]

export const mockDispatch = jest.fn(identity)
