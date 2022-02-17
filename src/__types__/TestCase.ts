import type Requirement from './Requirement'

type TestCase = {
  dimensions: {
    [dimension: string]: string
  }
  generation: number
} & Requirement

export default TestCase
