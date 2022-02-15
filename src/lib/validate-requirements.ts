import Ajv from 'ajv'

import requirementsSchema from '../__schemas__/requirements-schema'

export default validateRequirements

export function validateRequirements(data: unknown): boolean {
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
