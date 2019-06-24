const fs = require('fs')
const path = require('path')
const { format } = require('util')

function searchToken (filePath) {
  const reg = /8779~\w+/g
  const content = fs.readFileSync(filePath, 'utf8')
  return content.match(reg) || []
}

/** Returs a plain list of all the files on a directory (incl. subdirectories) */
async function walk (dirPath, exclude = () => false) {
  let files = []

  for (const fileName of fs.readdirSync(dirPath)) {
    const filePath = path.join(dirPath, fileName)
    const isDirectory = fs.statSync(filePath).isDirectory()

    if (isDirectory) {
      files = files.concat(await walk(filePath))
    } else if (! await exclude(filePath)){
      files.push(filePath)
    }
  }

  return files
}

module.exports = async function scanDirectory (dirPath) {
  const files = await walk(dirPath)
  const vulnerabilities = files
    .map(f => ({filepath: f, secrets: searchToken(f)}))
    .filter(f => f.secrets.length > 0)

  for (const entry of vulnerabilities) {
    console.log(format(`[${entry.filepath}]`))

    for (const secret of entry.secrets) {
      console.log(`>> ${secret}`)
    }

    console.log('')
  }
}
