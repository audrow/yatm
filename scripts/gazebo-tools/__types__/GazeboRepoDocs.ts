import GazeboDoc from './GazeboDoc'

type GazeboRepoDocs = {
  org: string
  repo: string
  branch: string
  majorVersion?: number
  localPath: string
  docs: GazeboDoc[]
  errors: string[]
}

export default GazeboRepoDocs
