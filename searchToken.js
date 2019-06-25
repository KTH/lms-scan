const fs = require('fs')

function inString (str) {
  const reg = /8779~\w+/g
  return str.match(reg) || []
}
/**
 * Search tokens in a file.
 */
function inFile (filePath) {
  const content = fs.readFileSync(filePath, 'utf8')
  return inString(content)
}

module.exports = {
  inFile,
  inString
}
