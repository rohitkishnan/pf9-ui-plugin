const config = {
  production: {
    host: 'https://domain.com:80',
    apiHost: 'https://domain.com:80',
  },

  development: {
    host: 'http://localhost:3000',
    apiHost: 'http://localhost:3000',
    simulator: {
      preset: 'base',
      username: 'user@domain.com',
      password: 'secret',
    }
  },

  testing: {
    host: 'http://localhost:3000',
    apiHost: 'http://localhost:4444',
    simulator: {
      preset: 'base',
      username: 'user@domain.com',
      password: 'secret',
    }
  },
}

const env = process.env.NODE_ENV || 'development'

module.exports = config[env]
