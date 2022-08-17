import type Repo from './test-cases/db/github/__types__/Repo'

export const GITHUB_TOKEN =
  process.env.GITHUB_TOKEN || 'GITHUB_TOKEN is not set'

export const RETRY_SECONDS = 60 * 5

export const REPOSITORY: Repo = {
  owner: 'audrow',
  name: 'gazebo-test-cases',
}
