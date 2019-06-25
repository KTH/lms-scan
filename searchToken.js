const fs = require('fs')

/**
 * Search tokens in a file.
 */
module.exports = function searchToken (filePath) {
  const reg = /8779~\w+/g
  const content = fs.readFileSync(filePath, 'utf8')
  return content.match(reg) || []
}
