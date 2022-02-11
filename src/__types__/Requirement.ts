import type Check from './Check'

type Requirement = {
  name: string
  description?: string
  labels?: string[]
  checks: Check[]
}

export default Requirement
