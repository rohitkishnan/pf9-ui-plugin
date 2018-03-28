/* eslint-disable no-unused-vars */
import context from '../context'
import Region from '../models/Region'
import Role from '../models/Role'
import Tenant from '../models/Tenant'
import User from '../models/User'
// import Token from '../models/Token'

function loadPreset () {
  console.log(`Loading 'dev' preset.`)
  const serviceTenant = new Tenant({ name: 'service' })
  for (let i = 0; i < 20; i++) {
    new Tenant({ name: `Tenant #${i}`, description: `${i}` })
  }
  const adminRole = new Role({ name: 'admin' })
  const memberRole = new Role({ name: '_member_' })
  const adminUser = new User({ username: 'admin@platform9.com', password: 'secret', tenant: serviceTenant })
  const region = new Region({ name: 'Default Region' })
  adminUser.addRole(adminRole)
}

export default loadPreset
