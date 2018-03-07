require('isomorphic-fetch')

const registry = require('./registry')

const urlWithHost = url => {
  const host = registry.getItem('host') || ''
  return `${host}${url}`
}

const authTokenHeader = () => ({ 'X-Auth-Token': registry.getInstance().token })

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
        const params = {
          method: 'GET',
          headers: {
            ...authTokenHeader()
          }
        }
        return fetch(urlWithHost(url), params).then(x => x.json())
      }
    }
  }
}

export default http
