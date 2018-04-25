const config = {
  production: {
    host: 'https://localhost',
    apiHost: 'https://localhost',
  },

  development: {
    host: 'http://localhost:3000',
    apiHost: 'http://localhost:4444',
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
