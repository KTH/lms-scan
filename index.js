#!/usr/bin/env node
const scanDirectory = require('./scanDirectory')
const scanRepo = require('./scanRepo')
const { format } = require('util')

if (process.argv.length >= 3 && process.argv[2] === 'history') {
  let result
  if (process.argv.length >= 4) {
    const found = process.argv[3].match(/(\w+)\.\.\.(\w+)/)
    if (found === null) {
      console.log('Format not valid')
      process.exit(1)
    }
    const [, from, to] = found
    result = scanRepo(process.cwd(), { from, to })
  } else {
    result = scanRepo(process.cwd())
  }

  result
    .then((vulnerabilities) => {
      for (const entry of vulnerabilities) {
        console.log(format(`[commit: ${entry.commit}]`))
        console.log(format(`[${entry.filepath}]`))

        for (const secret of entry.secrets) {
          console.log(`>> ${secret}`)
        }
        console.log()
      }
    })
    .catch(e => {
      if (e.name === 'GitRootNotFoundError') {
        console.error(`Directory [${process.cwd()}] is not part of any git repo`)
        process.exit(1)
      }
      console.error(e)
      process.exit(1)
    })
} else {
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
}
