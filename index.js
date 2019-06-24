#!/usr/bin/env node
const scanDirectory = require('./scanDirectory')
const scanRepo = require('./scanRepo')
const { format } = require('util')

if (process.argv.length > 3 && process.argv[2] === 'history') {
  const found = process.argv[3].match(/(\w+)\.\.\.(\w+)/)
  if (found === null) {
    console.log('Format not valid')
    process.exit(1)
  }

  const [, from, to] = found
  scanRepo(process.cwd(), { from, to })
  process.exit(0)
}

scanDirectory(process.cwd())
  .then(vulnerabilities => {
    for (const entry of vulnerabilities) {
      console.log(format(`[${entry.filepath}]`))

      for (const secret of entry.secrets) {
        console.log(`>> ${secret}`)
      }

      console.log('')
    }
  })
