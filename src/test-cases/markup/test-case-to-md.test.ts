import TestCase from '../__types__/TestCase'
import testCaseToMd from './test-case-to-md'

describe('testCaseToMd', () => {
  it('should render a test case', () => {
    const translationMap = {
      jammy: 'Ubuntu Jammy',
      installType: 'Install type',
      fastdds: 'FastDDS',
      dds: 'DDS vendor',
    }
    const testCase: TestCase = {
      name: 'test case',
      dimensions: {
        platform: 'jammy',
        dds: 'fastdds',
        installType: 'source',
      },
      generation: 37,
      checks: [
        {
          name: 'check',
          try: [
            {
              note: 'try',
              terminal: 1,
              stderr: 'stderr',
            },
          ],
          expect: [
            {
              note: 'expect',
              terminal: 1,
              stdout: 'stdout',
            },
            {
              note: 'expect',
              imageUrl: 'image url',
            },
          ],
        },
        {
          name: 'Name only check',
        },
        {
          name: 'Name only check 2',
        },
      ],
    }

    expect(testCaseToMd(testCase, translationMap)).toMatchSnapshot()
  })
})
