import type Requirement from '../../requirements/__types__/Requirement'

type TestCase = {
  dimensions: {
    [dimension: string]: string
  }
  generation: number
} & Requirement

export default TestCase
