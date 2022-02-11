import type Requirement from './Requirement'

export type Platform = 'jammy' | 'windows' | 'rhel' | 'focal'
export type Dds = 'fastdds' | 'cyclone' | 'connext'
export type InstallType = 'binary' | 'source'

type TestCase = {
  platform: Platform
  dds: Dds
  installType: InstallType
} & Requirement

export default TestCase
