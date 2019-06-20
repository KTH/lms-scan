#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

function searchToken (filePath) {
  const content = fs.readFileSync(filePath, 'utf8')
  return content.indexOf('8779~') !== -1
}

/** Returs a plain list of all the files on a directory (incl. subdirectories) */
function walk (dirPath) {
  let files = []

  for (const fileName of fs.readdirSync(dirPath)) {
    const filePath = path.join(dirPath, fileName)
    const isDirectory = fs.statSync(filePath).isDirectory()

    if (isDirectory) {
      files = files.concat(walk(filePath))
    } else {
      files.push(filePath)
    }
  }

  return files
}

const files = walk(process.cwd())
console.log('Scanning %d files', files.length)
const warnings = files.filter(searchToken)
console.log('Found %d problematic files', warnings.length)

for (const file of warnings) {
  console.log(file)
}
