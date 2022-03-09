import fs from 'fs'

function clearDirectory(directory: string) {
  if (fs.existsSync(directory)) {
    fs.rmSync(directory, {recursive: true})
  }
  fs.mkdirSync(directory, {recursive: true})
}

export default clearDirectory
