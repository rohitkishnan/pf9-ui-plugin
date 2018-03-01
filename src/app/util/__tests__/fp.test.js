import {
  identity,
  pluck,
} from '../fp'

describe('fp', () => {
  it('identity', () => {
    expect(identity(123)).toEqual(123)
  })

  it('pluck', () => {
    const obj = { foo: 'bar', another: 123 }
    const fn = pluck('foo')
    expect(fn(obj)).toEqual('bar')
  })
})
