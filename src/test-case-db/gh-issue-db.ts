/* eslint-disable @typescript-eslint/no-unused-vars */
import {Octokit} from 'octokit'

import TestCaseDb from '../__interfaces__/test-case-db'
import {GITHUB_API_TOKEN} from '../lib/constants'

import type TestCase from '../__types__/TestCase'
import type Repo from '../__types__/Repo'

class githubTestCaseDb implements TestCaseDb {
  octokit: Octokit
  repo: Repo

  constructor(octokit: Octokit, repo: Repo) {
    this.octokit = octokit
    this.repo = repo
  }

  async create(testCase: TestCase) {
    return ''
  }
  async read(id: string) {
    //
    return ''
  }
  async update(id: string, testCase: TestCase) {
    //
  }
  async delete(id: string) {
    //
  }
}

export function getTestCaseTitle(testCase: TestCase): string {
  return testCase.name
}

export default githubTestCaseDb

const gh = new Octokit({
  auth: GITHUB_API_TOKEN,
}).rest
