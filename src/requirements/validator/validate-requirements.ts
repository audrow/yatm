import Ajv from 'ajv'
import requirementsSchema from './schemas/requirements-schema'

export default validateRequirements

export function validateRequirements(data: unknown) {
  const ajv = new Ajv()
  const validate = ajv.compile(requirementsSchema)
  const valid = validate(data)
  if (!valid) {
    return validate.errors
  }
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
