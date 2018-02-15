import { getTokens } from './util/tokens'
require('isomorphic-fetch')

/*
 * req should look like this:
 *
 * request {
 *   url: '/foo',
 *   method: 'GET',
 *   headers: {},
 *   data: {},
 * }
 */

const http = ({ url, ...params }) => fetch(url, params)

const requestsByType = {
  text: req => http(req).then(res => res.text()),
  json: req => http(req).then(res => res.text()).then(text => text.length ? JSON.parse(text) : {}),
  arrayBuffer: req => http(req).then(res => res.arrayBuffer()),
  bare: req => http(req)
}

const contentTypes = {
  json: { 'Content-Type': 'application/json' },
}

let memoized = {}
export const memoize = (key, fn) => {
  if (memoized[key]) {
    return memoized[key]
  }
  memoized[key] = fn()
  return memoized[key]
}

const defaultErrorHandler = err => alert(err)
const defaultOptions = { responseType: 'json' }

export const bareJson = (req, options = defaultOptions) => {
  return requestsByType.bare({ ...req }).catch(defaultErrorHandler)
}

export const noAuth = (req, options = defaultOptions) => {
  let headers = req.headers || {}
  options = { ...defaultOptions, ...options }
  return requestsByType[options.responseType]({ ...req, headers }).catch(defaultErrorHandler)
}

export const authOpenstackHttp = (req, options = defaultOptions) => {
  let headers = req.headers || {}
  const tokens = getTokens()
  headers['X-Auth-Token'] = tokens.currentToken

  // To make sure if options is defined, but does not supply all the parameters,
  // options will still contain the other default parameters.
  options = { ...defaultOptions, ...options }

  return requestsByType[options.responseType]({ ...req, headers }).catch(defaultErrorHandler)
}

// Allow different http mechanisms to be used.  Just customize
// how you want HTTP calls to work and then pass that in.
//
// Most likely you will use it something like this:
// const glanceApi = makeApi(authOpenstackHttp('secretToken'), '/images').
export const makeApi = (http, baseUrl = '') => ({
  getReq (url, customHeaders = {}, options) {
    return http({
      method: 'GET',
      url: `${baseUrl}${url}`,
      headers: {...contentTypes.json, ...customHeaders}
    }, options)
  },

  postReqNotJson (url, body, customHeaders = {}, options) {
    return http({
      method: 'POST',
      url: `${baseUrl}${url}`,
      body: body,
      headers: customHeaders
    })
  },

  postReq (url, body, customHeaders = {}, options) {
    return http({
      method: 'POST',
      url: `${baseUrl}${url}`,
      body: JSON.stringify(body),
      headers: {...contentTypes.json, ...customHeaders}
    }, options)
  },

  putReq (url, body, customHeaders = {}) {
    return http({
      method: 'PUT',
      url: `${baseUrl}${url}`,
      body: (body && JSON.stringify(body)) || null,
      headers: {...contentTypes.json, ...customHeaders}
    })
  },

  patchReq (url, body, customHeaders = {}) {
    return http({
      method: 'PATCH',
      url: `${baseUrl}${url}`,
      body: (body && JSON.stringify(body)) || null,
      headers: {...contentTypes.json, ...customHeaders}
    })
  },

  deleteReq (url, customHeaders = {}) {
    return http({
      method: 'DELETE',
      url: `${baseUrl}${url}`,
      headers: customHeaders
    })
  }
})

export const toaster = {
  error: message => { alert(message) },
}
