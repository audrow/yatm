import checkSchema from './check-schema'

import type {JSONSchemaType} from 'ajv'
import type Requirement from '../__types__/Requirement'

const requirementSchema: JSONSchemaType<Requirement> = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 5,
    },
    description: {
      type: 'string',
      nullable: true,
    },
    links: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            minLength: 5,
          },
          url: {
            type: 'string',
          },
        },
        required: ['name', 'url'],
      },
      nullable: true,
    },
    labels: {
      type: 'array',
      items: {
        type: 'string',
      },
      nullable: true,
    },
    checks: {
      type: 'array',
      items: checkSchema,
      minItems: 1,
    },
  },
  required: ['name', 'checks'],
}

export default requirementSchema
