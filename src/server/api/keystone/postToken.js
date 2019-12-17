import Tenant from '../../models/openstack/Tenant'
import Token from '../../models/openstack/Token'
import User from '../../models/openstack/User'
import config from '../../../../config'
import { path } from 'ramda'

const simUsername = path(['simulator', 'username'], config)
const simToken = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'

const postToken = (req, res) => {
  const auth = req.body.auth

  const sendAuthError = (message, title) => {
    res.status(401).send({
      error: {
        code: 401,
        message:
          message || 'The request you made requires authentication.',
        title:
          title || 'Unauthorized',
      },
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
    const token = name === simUsername
      ? new Token({ user, id: simToken })
      : new Token({ user })
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
    const scopedToken = user.name === simUsername
      ? new Token({ user, tenant, id: simToken })
      : new Token({ user, tenant })
    return res.set('X-Subject-Token', scopedToken.id).status(201).send({ token: scopedToken.asJson() })
  }

  return sendAuthError()
}

export default postToken
