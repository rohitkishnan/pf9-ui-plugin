import faker from 'faker'

const fakeTenant = () => ({
  id: faker.random.uuid(),
  name: faker.random.word(),
  description: '',
})

export default fakeTenant
