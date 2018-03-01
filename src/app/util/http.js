require('isomorphic-fetch')

const registry = require('./registry')

const urlWithHost = url => {
  const host = registry.getItem('host') || ''
  return `${host}${url}`
}

const http = {
  bare: {},

  json: {
    post (url, body) {
      const params = {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        }
      }
      return fetch(urlWithHost(url), params)
    }
  },

  authenticated: {
    openstack: {
      get (url) {
        const { token } = registry.getInstance()
        const params = {
          method: 'GET',
          headers: {
            'X-Auth-Token': token,
          }
        }
        return fetch(urlWithHost(url), params)
      }
    }
  }
}

export default http
