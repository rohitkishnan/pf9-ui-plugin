import Tenant from '../Tenant'

const UUID_STRING_LENGTH = 36

describe('ActiveModel', () => {
  beforeEach(() => {
    Tenant.clearCollection()
  })

  it('creates an instance', () => {
    const tenant = new Tenant()
    expect(tenant).toBeDefined()
  })

  it('has an id by default', () => {
    const tenant = new Tenant()
    expect(tenant.id.length).toBe(UUID_STRING_LENGTH)
  })

  it('add itself to a collection', () => {
    const t1 = new Tenant()
    const t2 = new Tenant()
    expect(Tenant.getCollection().length).toBe(2)
    expect(Tenant.findById(t1.id)).toBeDefined()
    expect(Tenant.findById(t2.id)).toBeDefined()
  })

  it('clearCollection', () => {
    const t1 = new Tenant() // eslint-disable-line no-unused-vars
    expect(Tenant.getCollection().length).toBe(1)
    Tenant.clearCollection()
    expect(Tenant.getCollection().length).toBe(0)
  })

  it('destroy', () => {
    const t1 = new Tenant() // eslint-disable-line no-unused-vars
    expect(Tenant.getCollection().length).toBe(1)
    t1.destroy()
    expect(Tenant.getCollection().length).toBe(0)
  })
})
