import faker from 'faker'

const fakeFlavor = () => ({
  id: faker.random.uuid(),
  name: faker.random.word(),
  ram: faker.random.number(),
  disk: faker.random.number(),
  vcpus: faker.random.number(),
})

export default fakeFlavor
