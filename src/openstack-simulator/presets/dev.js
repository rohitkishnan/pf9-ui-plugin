/* eslint-disable no-unused-vars */
import context from '../context'
import Region from '../models/Region'
import Role from '../models/Role'
import Tenant from '../models/Tenant'
import User from '../models/User'
// import Token from '../models/Token'
import { range } from '../util'

function loadPreset () {
  console.log(`Loading 'dev' preset.`)
  const serviceTenant = new Tenant({ name: 'service' })

  // Create a bunch of tenants
  range(20).forEach(i => {
    new Tenant({ name: `Tenant #${i}`, description: `${i}` })
  })

  // Create an admin user
  const adminRole = new Role({ name: 'admin' })
  const memberRole = new Role({ name: '_member_' })
  const adminUser = new User({ username: 'admin@platform9.com', password: 'secret', tenant: serviceTenant })
  const region = new Region({ name: 'Default Region' })
  adminUser.addRole(adminRole)

  // Create a bunch of misc users
  range(10).forEach(i => {
    let user = new User({ username: `user${i}@platform9.com`, password: 'secret', tenant: serviceTenant })
    user.addRole(memberRole)
  })
}

export default loadPreset
