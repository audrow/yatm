import setupOutputDirectory from '../../cli/setup-output-directory'
import Requirement from '../../requirements/__types__/Requirement'
import RequirementFilter from '../__types__/RequirementFilter'
import type TestCaseDimensions from '../__types__/TestCaseDimensions'
import generateTestCases from './generate-test-cases'

const requirements: Requirement[] = [
  {
    name: 'requirement-1',
    labels: ['label-1', 'label-2'],
    checks: [
      {
        name: 'check-1',
        try: [
          {
            note: 'try note',
          },
        ],
        expect: [
          {
            note: 'expect note',
          },
        ],
      },
    ],
  },
  {
    name: 'requirement-2',
    labels: ['label-1'],
    checks: [
      {
        name: 'check-2',
        try: [
          {
            stdin: 'try stdin',
          },
        ],
        expect: [
          {
            stdout: 'expect stdout',
          },
        ],
      },
    ],
  },
]

const dimensions: TestCaseDimensions = {
  dds: ['dds-1', 'dds-2'],
  os: ['os-1', 'os-2'],
  buildType: ['buildType-1', 'buildType-2'],
}

const generation = 2

const filters: RequirementFilter[] = [
  {
    labels: ['^label-1$'],
    isMatch: true,
  },
  // {
  //   name: 'tutorial',
  //   regexOptions: 'i',
  //   isMatch: true,
  // },
]

setupOutputDirectory()
generateTestCases({
  requirements,
  dimensions,
  generation,
  filters,
})
