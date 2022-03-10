import fs from 'fs'
import * as constants from '../../constants'

function setupOutputDirectory() {
  if (fs.existsSync(constants.outputPath)) {
    fs.rmSync(constants.outputPath, {recursive: true})
  }
  fs.mkdirSync(constants.outputRequirementsPath, {recursive: true})
}

export default setupOutputDirectory
