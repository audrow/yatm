import Ajv from 'ajv'
import {
  validateRequirements,
  requirementsSchema,
  requirementSchema,
  checkSchema,
  stepSchema,
} from '../validate-requirements'

import type {
  Check,
  Requirement,
  Requirements,
  Step,
} from '../requirements-parser'

describe('validate step schema', () => {
  const ajv = new Ajv()
  const validate = ajv.compile(stepSchema)

  it("returns true with at least one property that's not terminal", () => {
    const steps: Step[] = [
      {
        note: 'some text',
      },
      {
        imageUrl: 'some url',
      },
      {
        stdin: 'some input',
      },
      {
        stdout: 'some output',
      },
      {
        stderr: 'some error',
      },
      {
        note: 'some text',
        imageUrl: 'some url',
        stdin: 'some input',
        stdout: 'some output',
        stderr: 'some error',
      },
    ]
    steps.forEach((step) => {
      expect(validate(step)).toBeTruthy()
      expect(
        validate({
          ...step,
          terminal: 1,
        }),
      ).toBeTruthy()
    })
  })
  it('returns false when only given the terminal', () => {
    expect(
      validate({
        terminal: 1,
      }),
    ).toBeFalsy()
  })
  it('returns false for unintended keys', () => {
    expect(
      validate({
        note: 'some text',
        foo: 'bar',
      }),
    ).toBeFalsy()
  })
  it('returns false an empty object', () => {
    expect(validate({})).toBeFalsy()
  })
})

describe('validate check schema', () => {
  const ajv = new Ajv()
  const validate = ajv.compile(checkSchema)

  const name = 'some name'
  const step: Step = {
    note: 'some text',
    stdin: 'some input',
    terminal: 1,
  }

  it('expects at least the name property', () => {
    const checks: Check[] = [
      {
        name,
      },
      {
        name,
        try: [step],
        expect: [step],
      },
      {
        name,
        try: [step, step, step],
        expect: [step, step],
      },
    ]

    checks.forEach((check) => {
      expect(validate(check)).toBeTruthy()
    })
  })
  it('requires at least one step in try and expect', () => {
    const checks: Check[] = [
      {
        name,
        try: [],
        expect: [],
      },
      {
        name,
        try: [step],
        expect: [],
      },
      {
        name,
        try: [],
        expect: [step],
      },
    ]
    checks.forEach((check) => {
      expect(validate(check)).toBeFalsy()
    })
  })
  it('expects try if there is a expect', () => {
    expect(
      validate({
        name,
        expect: [step],
      }),
    ).toBeFalsy()
  })
  it('expects expect if there is a try', () => {
    expect(
      validate({
        name,
        try: [step],
      }),
    ).toBeFalsy()
  })
  it('returns false on unknown properties', () => {
    expect(
      validate({
        name,
        foo: 'bar',
      }),
    ).toBeFalsy()
  })
})

describe('validate requirement schema', () => {
  const ajv = new Ajv()
  const validate = ajv.compile(requirementSchema)

  const check: Check = {
    name: 'some name',
  }
  const name = 'some requirement'
  it('requires names and checks', () => {
    const validRequirements: Requirement[] = [
      {
        name,
        checks: [check],
      },
      {
        name,
        checks: [check],
        description: 'some description',
      },
      {
        name,
        checks: [check],
        labels: ['some', 'labels'],
      },
      {
        name,
        checks: [check],
        description: 'some description',
        labels: ['some', 'labels'],
      },
    ]
    validRequirements.forEach((requirement) => {
      expect(validate(requirement)).toBeTruthy()
    })

    const invalidRequirements: Partial<Requirement>[] = [
      {
        name,
      },
      {
        checks: [check],
      },
      {
        labels: ['some', 'labels'],
      },
      {
        description: 'some description',
      },
      {
        labels: ['some', 'labels'],
        description: 'some description',
      },
    ]
    invalidRequirements.forEach((requirement) => {
      expect(validate(requirement)).toBeFalsy()
    })
  })
  it('expects at least one check', () => {
    expect(
      validate({
        name,
        checks: [],
      }),
    ).toBeFalsy()
  })
})

describe('validate requirements schema', () => {
  const ajv = new Ajv()
  const validate = ajv.compile(requirementsSchema)

  const requirement: Requirement = {
    name: 'some requirement',
    checks: [
      {
        name: 'some name',
      },
    ],
  }

  const validateFns: ((data: unknown) => boolean)[] = [
    validate,
    validateRequirements,
  ]
  validateFns.forEach((validateFn, idx) => {
    const methodNumber = idx + 1
    it(`returns true on valid requirements - method ${methodNumber}`, () => {
      const validRequirements: Requirements[] = [
        {
          requirements: [requirement],
        },
        {
          requirements: [requirement, requirement, requirement],
        },
      ]
      validRequirements.forEach((requirements) => {
        expect(validateFn(requirements)).toBeTruthy()
      })

      expect(
        validateFn({
          requirements: [],
        }),
      ).toBeFalsy()
    })
    it(`requires the requirement key - method ${methodNumber}`, () => {
      expect(validateFn({})).toBeFalsy()
    })
    it(`returns false on unknown key - method ${methodNumber}`, () => {
      expect(
        validateFn({
          foo: 'bar',
        }),
      ).toBeFalsy()
    })
  })
})
