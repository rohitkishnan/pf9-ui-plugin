/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS104: Avoid inline assignments
 * DS204: Change includes calls to have a more natural evaluation order
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
angular.module('pf9.session').factory('Session', function ($rootScope, Keystone, EasyHttp, pf9Storage, Permissions, Token, $interval, $window) {
  var Session = {
    intervals: {},
    tokens: {},
    userTenants: [], // the list of tenants available to the user
    userByTenant: {}, // the user's roles scoped by tenant
    services: [],

    clearSession () {
      delete Session.user
      pf9Storage.clear('user')
      pf9Storage.clear('tokens')
      pf9Storage.clear('userTenants')
      pf9Storage.clear('currentTenant')
      pf9Storage.clear('currentRegion')
      Permissions.setDefaultPerms()
      delete Token.tokens
      Session.clearIntervals()
      return $rootScope.$broadcast('session:cleared')
    },

    isAuserAuthenticated () {
      return (Session.user !== undefined) && (Session.user.username !== undefined)
    },

    getToken () {
      return (Token.tokens != null ? Token.tokens.currentToken : undefined)
    },

    refreshUserTenants (cb) {
            // SessionInterceptor can't access Session due to a circular dependency so we are forced to store it in LocalStorage
      pf9Storage.set('tokens', Token.tokens)
      return Keystone.getScopedProjects().then(function (tenants) {
        let userTenants
        Session.userTenants = (userTenants = tenants.data.projects)
        for (let userTenant of Array.from(userTenants)) {
          if (userTenant.id === Session.currentTenant.id) {
            Session.currentTenant.name = userTenant.name
          }
        }

        pf9Storage.set('userTenants', userTenants)
        $rootScope.$broadcast('userTenants:refreshed')
        return (typeof cb === 'function' ? cb(userTenants) : undefined)
      })
    },

    signIn (username, password, mfa, successCb, errorCb) {
      if (mfa) {
        password = password + mfa
      }
      return Keystone.getUnscopedToken(username, password).then(function (response) {
        const unscopedToken = response.headers()['x-subject-token']
        return Session.signInUnscopedToken(unscopedToken, username, successCb, errorCb)
      }
            , err => errorCb())
    },

    signInUnscopedToken (unscopedToken, username, successCb, errorCb) {
      if (!unscopedToken) { return toastr.error('unable to get unscoped token') }
      const tokens = {
        tenants: {},
        currentToken: unscopedToken,
        unscopedToken,
        tempToken: null // used for one-time requests that require using a different token
      }
      Token.tokens = tokens
      pf9Storage.set('tokens', tokens)

      return Keystone.getScopedProjects().then(function (tenants) {
        let userTenants
        if (!(tenants.data.projects.length > 0)) {
          $rootScope.$broadcast('login:failed')
          return toastr.error(`No tenant found for ${username}`)
        }

        Session.userTenants = (userTenants = tenants.data.projects)
        pf9Storage.set('userTenants', userTenants)
        $rootScope.$broadcast('userTenants:refreshed')

        let lastTenant = pf9Storage.get(`last-tenant-accessed-${username}`)
        if (!lastTenant) { lastTenant = 'service' }

                    // pick first tenant if priority tenant is unavailable
        let defaultTenant = userTenants[0]
        for (let tenant of Array.from(userTenants)) {
          if (tenant.name === lastTenant) { defaultTenant = tenant }
        }
        if ((defaultTenant.name === 'admin') && (userTenants.length > 1)) {
          defaultTenant = userTenants[1]
        }
        if ($rootScope.sandbox) {
          let tenant_expr = 'tenant-'
          if ($rootScope.cloudStack === 'k8s') {
            tenant_expr = $rootScope.kube_sandbox_tenant
          }
          const sandbox_tenant = Session.userTenants.filter(function (t) { if (t.name.match(tenant_expr)) { return t } })
          if (sandbox_tenant.length > 0) {
            defaultTenant = sandbox_tenant[0]
          }
        }

                    // log in to last region accessed, or first region in list
        return Keystone.getRegions().then(function (response) {
          let needle
          const lastRegion = pf9Storage.get(`last-region-accessed-${username}`)
          if (lastRegion && (needle = lastRegion.id, Array.from((Array.from(response.data.regions).map((region) => region.id))).includes(needle))) {
            Session.currentRegion = lastRegion
            pf9Storage.set('currentRegion', lastRegion)
          } else {
            Session.currentRegion = response.data.regions[0]
            pf9Storage.set('currentRegion', response.data.regions[0])
          }

          return Keystone.getScopedToken(defaultTenant.id, unscopedToken).then(function (response) {
            const scopedToken = response.headers()['x-subject-token']
            const { roles } = response.data.token
            const { user } = response.data.token
            if (!scopedToken) { return toastr.error('unable to get scoped token') }
            Session.setCurrentTenant(defaultTenant, user, scopedToken, roles)//, response.access.serviceCatalog
            successCb(Session.user)
            return $rootScope.$broadcast('session:signIn')
          })
        })
      })
    },

    signInSso (username, unscopedToken, successCb, errorCb) {
      const tokens = {
        tenants: {},
        currentToken: unscopedToken,
        unscopedToken,
        tempToken: null, // used for one-time requests that require using a different token
        ssoToken: true
      }
      Token.tokens = tokens
      pf9Storage.set('tokens', tokens)
      $rootScope.isSsoUser = true

      return Keystone.getScopedProjects().then(function (tenants) {
        let userTenants
        if (!(tenants.data.projects.length > 0)) {
          $rootScope.$broadcast('login:failed')
          return toastr.error('No tenant found for group')
        }

        Session.userTenants = (userTenants = tenants.data.projects)
        pf9Storage.set('userTenants', userTenants)
        $rootScope.$broadcast('userTenants:refreshed')

        let lastTenant = pf9Storage.get(`last-tenant-accessed-${username}-sso`)
        if (!lastTenant) { lastTenant = 'service' }

                // pick first tenant if priority tenant is unavailable
        let defaultTenant = userTenants[0]
        for (let tenant of Array.from(userTenants)) {
          if (tenant.name === lastTenant) { defaultTenant = tenant }
        }
        if ((defaultTenant.name === 'admin') && (userTenants.length > 1)) {
          defaultTenant = userTenants[1]
        }

                // log in to last region accessed, or first region in list
        return Keystone.getRegions().then(function (response) {
          let needle
          const lastRegion = pf9Storage.get(`last-region-accessed-${username}-sso`)
          if (lastRegion && (needle = lastRegion.id, Array.from((Array.from(response.data.regions).map((region) => region.id))).includes(needle))) {
            Session.currentRegion = lastRegion
            pf9Storage.set('currentRegion', lastRegion)
          } else {
            Session.currentRegion = response.data.regions[0]
            pf9Storage.set('currentRegion', response.data.regions[0])
          }

          return Keystone.getScopedTokenSso(defaultTenant.id, unscopedToken).then(function (response) {
            const scopedToken = response.headers()['x-subject-token']
            const { roles } = response.data.token
            let { user } = response.data.token
            if (!scopedToken) { return toastr.error('unable to get scoped token') }
            return Session.setCurrentTenant(defaultTenant, user, scopedToken, roles, null, () =>
                            Keystone.getUser(user.id).then(function (response) {
                              ({ user } = response.data)
                              Session.user.username = user.name
                              Session.user.userId = user.id
                              pf9Storage.set('user', Session.user)
                              successCb(Session.user)
                              return $rootScope.$broadcast('session:signIn')
                            })
                        )
          }
                    , err => errorCb())
        })
      })
    },

    signOut () {
      Session.clearSession()
      return $rootScope.$broadcast('session:signOut')
    },

    updatePassword (oldPassword, newPassword, success, error) {
      const data = {
        user: {
          original_password: oldPassword,
          password: newPassword
        }
      }
      return EasyHttp.post(`/keystone/v3/users/${Session.user.userId}/password`, data, success, error)
    },

    registerInterval (key, seconds, fn) {
      if (Session.intervals[key]) { $interval.cancel(Session.intervals[key]) }
      const promise = $interval(fn, seconds * 1000)
      return Session.intervals[key] = promise
    },

    clearIntervals () {
      for (let key in Session.intervals) { const fn = Session.intervals[key]; $interval.cancel(fn) }
      return Session.intervals = {}
    },

    getUserTenants (cb) {
      if (Session.userTenants && (Session.userTenants.length > 0)) { return cb(Session.userTenants) }
      return cb(pf9Storage.get('userTenants'))
    },

        // need to deprecate this
    setServices (catalog) {
      const translatedCatalog = {}
      for (let service of Array.from(catalog)) {
        for (let endpoint of Array.from(service.endpoints)) {
          if (!translatedCatalog[endpoint.region]) { translatedCatalog[endpoint.region] = [] }
          if (endpoint.interface === 'public') { translatedCatalog[endpoint.region].push({name: service.name, type: service.type, url: endpoint.url}) }
        }
      }
      return Session.services = translatedCatalog
    },

        // should maybe remove this and only use v3
    getServices (cb) {
      if ((Session.services != null ? Session.services.length : undefined) > 0) { return cb(Session.services) }
      if (Token.tokens.ssoToken) {
        return Keystone.getScopedTokenWithCatalogSso(Session.currentTenant.id, Token.tokens.unscopedToken, function (response) {
          Session.setServices(response.token.catalog)
          if (cb) { return cb(Session.services) }
        })
      } else {
        return Keystone.getScopedTokenWithCatalog(Session.currentTenant.id, Token.tokens.unscopedToken, function (response) {
          Session.setServices(response.token.catalog)
          if (cb) { return cb(Session.services) }
        })
      }
    },

    refreshScopedToken (cb) {
      const currentTenant = pf9Storage.get('currentTenant')
      const currentTokens = pf9Storage.get('tokens')
      const { unscopedToken } = currentTokens
      if (Token.tokens.ssoToken) {
        return Keystone.getScopedTokenSso(currentTenant.id, unscopedToken).then(function (response) {
          const scopedToken = response.headers()['x-subject-token']
          currentTokens.currentToken = scopedToken
          Token.tokens = currentTokens
          pf9Storage.set('tokens', currentTokens)
          if (cb) { return cb() }
        })
      } else {
        return Keystone.getScopedToken(currentTenant.id, unscopedToken).then(function (response) {
          const scopedToken = response.headers()['x-subject-token']
          currentTokens.currentToken = scopedToken
          Token.tokens = currentTokens
          pf9Storage.set('tokens', currentTokens)
          if (cb) { return cb() }
        })
      }
    },

    setCurrentTenant (tenant, user, scopedToken, roles, services, cb) {
      let role
      if (user) {
        Session.userByTenant[tenant.name] = user
        pf9Storage.set('userByTenant', Session.userByTenant)
      } else {
        user = Session.userByTenant[tenant.name]
      }

      Session.roles.tenants[tenant.name] = roles

      const roleNames = ((() => {
        const result = []
        for (role of Array.from(roles)) {
          result.push(role.name)
        }
        return result
      })())
      if (Array.from(roleNames).includes('admin')) {
        role = 'admin'
      } else if (Array.from(roleNames).includes('_member_')) {
        role = '_member_'
      } else {
        role = roleNames[0]
      }
      Session.user = {
        username: user.name || user.username,
        userId: user.id || user.userId
      }
      Session.user['role'] = role
      pf9Storage.set('user', Session.user)
      Permissions.setPermsFor(role)

      Session.currentTenant = tenant
      pf9Storage.set('currentTenant', tenant)

      Session.user.tenantId = tenant.id
      Session.user.tenantName = tenant.name
      pf9Storage.set('user', Session.user)

      if (scopedToken) { Token.tokens.tenants[tenant.name] = scopedToken }
      Token.tokens.currentToken = Token.tokens.tenants[tenant.name]

            // Not using Angular's $cookies because it doesn't support setting the "path" part.
            // Also, we are using gzip on the Keystone token because cookies have a max length of 4096. [IAAS-1629]
            // The Keystone token exceeds this.  Compressing it makes it fit within this limit.
            // We are using the 'pako' library to deflate the token.

            // I may not need this anymore with the new token2cookie request
            // token = Token.tokens.currentToken
            // uInt8Arr = new Uint8Array(token.length) # pako.deflate requires UInt8Array.
            // for i in [0..(token.length)]
            //     uInt8Arr[i] = token.charCodeAt(i)
            // compressed = pako.deflate(uInt8Arr)
            // # convert Uint8Array to string then b64encode
            // b64Compressed = btoa(String.fromCharCode.apply(null, compressed))
            // d = new Date()
            // d.setTime(d.getTime() + 2*24*60*60*1000) # 2 days into the future
            // expiration = d.toUTCString()
            // cookieStr = "X-Auth-Token=#{b64Compressed};secure;expires=#{expiration};path=/"
            // document.cookie = cookieStr

      pf9Storage.set('tokens', Token.tokens)
      pf9Storage.set(`last-tenant-accessed-${Session.user.username}`, tenant.name)
            // need to send event to ServiceCatalog to avoid circular dependency
      $rootScope.$broadcast('changeTenant')
      if (cb) {
        return cb()
      }
    },

    switchToTenant (tenant) {
      if ((Token.tokens != null ? Token.tokens.tenants[tenant.name] : undefined) && (Session.roles != null ? Session.roles.tenants[tenant.name] : undefined)) {
        Session.user = pf9Storage.get('user')
        return Session.setCurrentTenant(tenant, Session.user, Token.tokens.tenants[tenant.name], Session.roles.tenants[tenant.name], null, function () {
          if ($rootScope.isSsoUser) {
            return Keystone.getUser(Session.user.userId).then(function (response) {
              const { user } = response.data
              Session.user.username = user.name
              Session.user.userId = user.id
              return pf9Storage.set('user', Session.user)
            })
          }
        })
      } else {
        if (Token.tokens.ssoToken) {
          return Keystone.getScopedTokenSso(tenant.id, Token.tokens.unscopedToken).then(function (response) {
            const scopedToken = response.headers()['x-subject-token']
            if (!scopedToken) { return toastr.error('unable to get scoped token') }
            const { roles } = response.data.token
            let { user } = response.data.token
            return Session.setCurrentTenant(tenant, user, scopedToken, roles, null, function () {
              if ($rootScope.isSsoUser) {
                return Keystone.getUser(user.id).then(function (response) {
                  ({ user } = response.data)
                  Session.user.username = user.name
                  Session.user.userId = user.id
                  return pf9Storage.set('user', Session.user)
                })
              }
            })
          })
        } else {
          return Keystone.getScopedToken(tenant.id, Token.tokens.unscopedToken).then(function (response) {
            const scopedToken = response.headers()['x-subject-token']
            if (!scopedToken) { return toastr.error('unable to get scoped token') }
            const { roles } = response.data.token
            const { user } = response.data.token
            return Session.setCurrentTenant(tenant, user, scopedToken, roles)
          })
        }
      }
    },

    switchRegion (region) {
            // set region in localstorage and refresh page
      Session.currentRegion = region
      pf9Storage.set('currentRegion', region)
      pf9Storage.set(`last-region-accessed-${Session.user.username}`, region)
      return $window.location.reload()
    }
  }

    // Initialize session, attempt to continue previous session if exists

    // consider loading roles from local storage
  Session.roles =
        {tenants: {}}
  Session.currentTenant = pf9Storage.get('currentTenant')
  Session.currentRegion = pf9Storage.get('currentRegion')
  Session.userByTenant = (pf9Storage.get('userByTenant')) || {}
  Session.user = pf9Storage.get('user')
    // Session.services = pf9Storage.get 'services'
  if (Session.user) { Permissions.setPermsFor(Session.user.role) }

    // Make sure that region still exists if already logged in
  if (Token.tokens) {
    Keystone.getRegions().then(function (response) {
      let needle
      const currentRegion = pf9Storage.get('currentRegion')
      if ((needle = currentRegion.id, Array.from((Array.from(response.data.regions).map((region) => region.id))).includes(needle))) {
        Session.currentRegion = currentRegion
      } else {
        Session.currentRegion = response.data.regions[0]
        pf9Storage.set('currentRegion', response.data.regions[0])
        pf9Storage.set(`last-region-accessed-${Session.user.username}`, response.data.regions[0])
      }
      const cloudStackKey = `${Session.user.userId},${Session.currentRegion.id}-cloudStack`
      const lastCloudStack = pf9Storage.get(cloudStackKey)
      $rootScope.$broadcast('lastCloudStack:loaded', lastCloudStack)
      return $rootScope.$broadcast('region:loaded')
    })
    if (Token.tokens.ssoToken) {
      $rootScope.isSsoUser = true
    }
  }

  $rootScope.$on('session:clear', Session.clearSession)

  $rootScope.isAdmin = () => (__guard__(Session != null ? Session.user : undefined, x => x.role) === 'admin') || (__guard__(Session != null ? Session.user : undefined, x1 => x1.role) === 'sandbox')

  return Session
})

function __guard__ (value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined
}
