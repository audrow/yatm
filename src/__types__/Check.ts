import type Step from './Step'

type Check = {
  name: string
  try?: Step[]
  expect?: Step[]
}

export default Check
