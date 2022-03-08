import type {JSONSchemaType} from 'ajv'
import type Requirements from '../../__types__/Requirements'
import requirementSchema from './requirement-schema'

const requirementsSchema: JSONSchemaType<Requirements> = {
  type: 'object',
  properties: {
    requirements: {
      type: 'array',
      items: requirementSchema,
      minItems: 1,
    },
  },
  required: ['requirements'],
}

export default requirementsSchema
