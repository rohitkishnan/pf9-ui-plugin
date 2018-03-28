import context from '../context'
import ActiveModel from './ActiveModel'
import { findById } from '../helpers'

const coll = () => context.users

class User extends ActiveModel {
  constructor (params = {}) {
    super(params)
    this.roles = params.roles || []
    this.username = params.username
    this.password = params.password
    this.tenant = params.tenant
    this.mfa = params.mfa || false
  }

  static getCollection = coll
  static clearCollection = () => coll().splice(0, coll().length)
  static findById = findById(coll)

  static findByUsername = username => User.getCollection().find(x => x.username === username)

  static getAuthenticatedUser = (username, password) => {
    const user = User.findByUsername(username)
    if (!user) {
      return null
    }
    const attemptedPassword = `${password}${user.mfa || ''}`
    return user.password === attemptedPassword ? user : null
  }

  // TODO
  getTenants = () => []

  addRole = role => this.roles.push(role)

  asJson = () => {
    return {
      ...super.asJson(),
      name: this.username,
    }
  }
}

export default User
