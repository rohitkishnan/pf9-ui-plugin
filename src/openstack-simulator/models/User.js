import context from '../context'
import ActiveModel from './ActiveModel'
import { findById } from '../helpers'

const coll = () => context.users

class User extends ActiveModel {
  constructor (params = {}) {
    super(params)
    this.displayname = params.displayname || params.name || params.email || ''
    this.email = params.email || ''
    this.mfa = params.mfa || false
    this.password = params.password
    this.roles = params.roles || []
    this.tenant = params.tenant
    this.username = params.username || ''
    this.displayname = params.name || params.displayname || params.email || ''
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
      displayname: this.displayName,
      email: this.email,
      name: this.name,
      username: this.username,
    }
  }
}

export default User
