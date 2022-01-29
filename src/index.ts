import Person from './__types__/Person'

export function whoIsYounger(personA: Person, personB: Person): Person {
  return personA.age < personB.age ? personA : personB
}
