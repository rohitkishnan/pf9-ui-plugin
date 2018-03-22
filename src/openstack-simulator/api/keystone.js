import context from '../context'
import express from 'express'

import Region from '../models/Region'
import Tenant from '../models/Tenant'
import Token from '../models/Token'
import User from '../models/User'

import { mapAsJson, notImplementedYet } from '../helpers' // eslint-disable-line no-unused-vars
import { tokenValidator } from '../middleware'

export const validateToken = authToken => {
  const tokens = context.tokens || {}
  return tokens[authToken]
}

const postToken = (req, res) => {
  const auth = req.body.auth

  const sendAuthError = (message, title) => {
    res.status(401).send({
      error: {
        code: 401,
        message:
          message || 'The request you made requires authentication.',
        title:
        title || 'Unauthorized'
      }
    })
  }
  if (!auth || !auth.identity) {
    return sendAuthError()
  }

  // Password authentication
  const passwordMethod = auth.identity.password
  if (passwordMethod) {
    const { user: { name, password } } = passwordMethod
    const user = User.getAuthenticatedUser(name, password)
    if (!user) {
      return sendAuthError()
    }
    const token = new Token({ user })
    return res.set('X-Subject-Token', token.id).status(201).send({ token: token.asJson() })
  }

  // Token authentication
  const tokenMethod = auth.identity.token
  if (tokenMethod) {
    const unscopedToken = Token.validateToken(tokenMethod.id)
    if (!unscopedToken) {
      return sendAuthError()
    }
    const user = unscopedToken.user
    const tenantScopeId = auth.scope && auth.scope.project && auth.scope.project.id
    const tenant = Tenant.findById(tenantScopeId)
    if (!tenant) {
      return sendAuthError('Must supply valid tenant for scope', 'Scope Required')
    }
    const scopedToken = new Token({ user, tenant })
    return res.set('X-Subject-Token', scopedToken.id).status(201).send({ token: scopedToken.asJson() })
  }

  return sendAuthError()
}

const getProjects = (req, res) => {
  const tenants = mapAsJson(Tenant.getCollection())
  // TODO: need to filter this list by what the user is allowed to see
  return res.send({ projects: tenants })
}

const getRegions = (req, res) => {
  const regions = mapAsJson(Region.getCollection())
  // TODO: need to filter this list by what the user is allowed to see
  return res.send({ regions })
}

const router = express.Router()

router.post('/v3/auth/tokens', postToken)
router.get('/v3/regions', getRegions)

// Everything past this point requires authentication
router.get('/v3/auth/projects', tokenValidator, getProjects)

export default router
