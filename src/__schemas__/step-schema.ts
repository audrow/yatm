import type {JSONSchemaType} from 'ajv'
import type Step from '../__types__/Step'

export const stepSchema: JSONSchemaType<Step> = {
  type: 'object',
  properties: {
    terminal: {
      type: 'number',
      nullable: true,
    },
    note: {
      type: 'string',
      nullable: true,
    },
    imageUrl: {
      type: 'string',
      nullable: true,
    },
    stdin: {
      type: 'string',
      nullable: true,
    },
    stdout: {
      type: 'string',
      nullable: true,
    },
    stderr: {
      type: 'string',
      nullable: true,
    },
  },
  anyOf: [
    {
      required: ['note'],
    },
    {
      required: ['imageUrl'],
    },
    {
      required: ['stdin'],
    },
    {
      required: ['stdout'],
    },
    {
      required: ['stderr'],
    },
  ],
  additionalProperties: false,
}

export default stepSchema
