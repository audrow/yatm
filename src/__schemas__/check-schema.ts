import stepSchema from './step-schema'

import type {JSONSchemaType} from 'ajv'
import type Check from '../__types__/Check'

const checkSchema: JSONSchemaType<Check> = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 5,
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
    try: ['expect'],
    expect: ['try'],
  },
}

export default checkSchema
