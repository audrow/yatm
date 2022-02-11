import Ajv from 'ajv'
import type {JSONSchemaType} from 'ajv'

import type {
  Check,
  Requirement,
  Requirements,
  Step,
} from './requirements-parser'

const stepSchema: JSONSchemaType<Step> = {
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
    },
    expect: {
      type: 'array',
      items: stepSchema,
      nullable: true,
    },
  },
  required: ['name'],
  minProperties: 1,
  additionalProperties: false,
  dependencies: {
    try: ['expect'],
    expect: ['try'],
  },
}

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
    },
  },
  required: ['name'],
}

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

export default function validateRequirements(data: unknown): boolean {
  const ajv = new Ajv()
  const validate = ajv.compile(requirementsSchema)
  const valid = validate(data)
  if (!valid) {
    console.error(validate.errors)
    return false
  }
  return true
}

if (typeof require !== 'undefined' && require.main === module) {
  const data = {
    requirements: [
      {
        name: 'req name',
        checks: [
          {
            name: 'check 1 name',
            try: [
              {
                terminal: 1,
                imageUrl: 'image url',
              },
            ],
            expect: [
              {
                terminal: 1,
                note: 'note',
              },
            ],
          },
          {
            name: 'check 2 name',
          },
        ],
      },
    ],
  }
  validateRequirements(data)
}
