/* eslint-disable camelcase */
import context from '../../context'
import ActiveModel from '../ActiveModel'
import { findById, mapAsJson, jsonOrNull } from '../../helpers'
import moment from 'moment'

const coll = () => context.tokens

class Token extends ActiveModel {
  constructor (params = {}) {
    super(params)
    this.user = params.user || {}
    this.tenant = params.tenant || null

    // Note: Users can actually have more than one role in a tenant,
    // but that's not currently implemented in the simulator
    const tenantRole = this.user.roles && this.user.roles.filter((role) => this.tenant && role.tenant.id === this.tenant.id)
    this.roles = tenantRole && tenantRole[0] ? [tenantRole[0].role] : []
    return this
  }

  static getCollection = coll
  static clearCollection = () => coll().splice(0, coll().length)
  static findById = findById(coll)

  static validateToken = tokenId => Token.findById(tokenId) || null

  asJson = () => {
    return {
      ...super.asJson(),
      expires_at: moment().add(1, 'day').format(),
      issued_at: moment().format(),
      project: jsonOrNull(this.tenant),
      roles: mapAsJson(this.roles),
      user: jsonOrNull(this.user),
    }
  }
}

export default Token
