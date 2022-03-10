import fs from 'fs'
import * as constants from '../../constants'

function setupOutputDirectory() {
  if (fs.existsSync(constants.OUTPUT_PATH)) {
    fs.rmSync(constants.OUTPUT_PATH, {recursive: true})
  }
  fs.mkdirSync(constants.OUTPUT_REQUIREMENTS_PATH, {recursive: true})
}

export default setupOutputDirectory
