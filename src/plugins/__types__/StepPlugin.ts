import type {JSONSchemaType} from 'ajv'
import type Step from '../../requirements/__types__/Step'

type StepPlugin = {
  name: string
  stepSchema: JSONSchemaType<unknown>
  markup: {
    [key: string]: (step: Step) => string
  }
}

export default StepPlugin
