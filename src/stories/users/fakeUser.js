import faker from 'faker'

const fakeUser = () => ({
  id: faker.random.uuid(),
  name: faker.internet.email(),
  displayname: faker.fake('{{name.firstName}} {{name.lastName}}'),
})

export default fakeUser
