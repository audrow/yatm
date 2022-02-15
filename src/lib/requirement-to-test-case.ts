import type Requirement from '../__types__/Requirement'

function requirementToTestCase(
  req: Requirement,
  dimensions: {[key: string]: string},
  generation: number,
) {
  return {
    dimensions,
    generation,
    ...req,
  }
}

export default requirementToTestCase
