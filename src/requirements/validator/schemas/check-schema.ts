import type {JSONSchemaType} from 'ajv'
import type Check from '../../__types__/Check'
import stepSchema from './step-schema'

const checkSchema: JSONSchemaType<Check> = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 5,
    },
    description: {
      type: 'string',
      minLength: 5,
      nullable: true,
    },
    try: {
      type: 'array',
      items: stepSchema,
      nullable: true,
      minItems: 1,
    },
    expect: {
      type: 'array',
      items: stepSchema,
      nullable: true,
      minItems: 1,
    },
  },
  required: ['name'],
  additionalProperties: false,
  dependencies: {
    expect: ['try'],
  },
}

export default checkSchema
