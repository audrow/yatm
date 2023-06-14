import type RequirementFilter from './RequirementFilter'

type Config = {
  generation: number
  sets: {
    filters: RequirementFilter[]
    dimensions: {
      [key: string]: string[]
    }
  }[]
  translation_map: {
    [key: string]: string
  }
}

export default Config
