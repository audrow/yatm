import type Check from './Check'
import type Link from './Link'

type Requirement = {
  name: string
  description?: string
  labels?: string[]
  links?: Link[]
  checks: Check[]
}

export default Requirement
