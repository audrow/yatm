import fs from 'fs'
import * as constants from '../constants'

function setupOutputDir() {
  if (fs.existsSync(constants.outputPath)) {
    fs.rmSync(constants.outputPath, {recursive: true})
  }
  fs.mkdirSync(constants.outputRequirementsPath, {recursive: true})
  fs.mkdirSync(constants.outputTestCasePath, {recursive: true})
  fs.mkdirSync(constants.outputTestCaseRenderPath, {recursive: true})
}

export default setupOutputDir
