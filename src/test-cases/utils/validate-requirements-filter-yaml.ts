import type {JSONSchemaType} from 'ajv'
import Ajv from 'ajv'
import Config from '../__types__/Config'

const configSchema: JSONSchemaType<Config> = {
  type: 'object',
  properties: {
    generation: {
      type: 'number',
      minimum: 1,
    },
    translation_map: {
      type: 'object',
      properties: {},
      additionalProperties: true,
      required: [],
    },
    sets: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          filters: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                isMatch: {
                  type: 'boolean',
                },
                name: {
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
                regexOptions: {
                  type: 'string',
                  nullable: true,
                },
              },
              required: ['isMatch'],
              additionalProperties: false,
            },
            minItems: 1,
          },
          dimensions: {
            type: 'object',
            patternProperties: {
              '^[a-zA-Z0-9-_]+$': {
                type: 'array',
                items: {
                  type: 'string',
                },
                minItems: 1,
              },
            },
            required: [],
            minProperties: 1,
          },
        },
        required: ['filters', 'dimensions'],
        additionalProperties: false,
      },
      minItems: 1,
    },
  },
  required: ['generation', 'translation_map', 'sets'],
  additionalProperties: false,
}

function validateConfigYaml(data: unknown, path: string) {
  const error = validateConfig(data)
  if (error) {
    console.error(error)
    console.error(`ERROR: Invalid file ${path}`)
    process.exit(1)
  }
}

function validateConfig(data: unknown) {
  const ajv = new Ajv()
  const validate = ajv.compile(configSchema)
  const valid = validate(data)
  if (!valid) {
    return validate.errors
  }
}

export default validateConfigYaml
