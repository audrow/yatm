import {whoIsYounger} from '../index'

describe('whoIsYounger', () => {
  it('should return the younger person', () => {
    const personA = {
      name: 'John',
      age: 20,
    }
    const personB = {
      name: 'Jane',
      age: 30,
    }
    const result = whoIsYounger(personA, personB)
    expect(result).toBe(personA)
  })
})
