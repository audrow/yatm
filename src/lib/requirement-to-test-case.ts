import type Requirement from '../__types__/Requirement'
import type {Dds, InstallType, Platform} from '../__types__/TestsCase'

function requirementToTestCase(
  req: Requirement,
  platform: Platform,
  dds: Dds,
  installType: InstallType,
) {
  return {
    installType,
    platform,
    dds,
    ...req,
  }
}

export default requirementToTestCase
