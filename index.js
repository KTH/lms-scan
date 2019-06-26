#!/usr/bin/env node
const scanDirectory = require('./scanDirectory')
const scanRepo = require('./scanRepo')
const Canvas = require('@kth/canvas-api')

function printVulnerabilities (vulnerabilities) {
  for (const entry of vulnerabilities) {
    if (entry.commit) {
      console.log(`[commit ${entry.commit}]`)
    }
    console.log(`[${entry.filepath}]`)

    for (const secret of entry.secrets) {
      console.log(`>> ${secret}`)
    }
    console.log('')
  }
}

async function checkAgainstCanvas (vulnerabilities) {
  const invalidTokens = new Map()
  for (const entry of vulnerabilities) {
    entry.secrets.forEach(secret => invalidTokens.set(secret, false))
  }

  for (const [token] of invalidTokens) {
    const canvas = Canvas('https://kth.instructure.com/api/v1', token)
    try {
      await canvas.get('/users/self')
    } catch (e) {
      invalidTokens.set(token, e.statusCode === 401)
    }
  }

  return vulnerabilities
    .map(v => ({
      ...v,
      secrets: v.secrets.filter(s => !invalidTokens.get(s))
    }))
    .filter(v => v.secrets.length > 0)
}

// eslint-disable-next-line no-unused-expressions
require('yargs')
  .command('$0', 'Scan the current directory', () => {}, async (argv) => {
    let found = await scanDirectory(process.cwd())
    if (argv.r) {
      found = await checkAgainstCanvas(found)
    }

    printVulnerabilities(found)
    process.exit(found.length === 0 ? 0 : 1)
  })
  .command('history [range]', 'Scan the current repository', () => {}, async (argv) => {
    let found
    if (argv.range) {
      const range = argv.range.match(/(\w+)\.\.\.(\w+)/)
      if (range === null) {
        console.log(`Unable to parse the range "${argv.range}". The format must be "<start>...<end>"`)
        process.exit(1)
      }

      const [, from, to] = range
      found = await scanRepo(process.cwd(), { from, to })
    } else {
      found = await scanRepo(process.cwd())
    }
    if (argv.r) {
      found = await checkAgainstCanvas(found)
    }

    printVulnerabilities(found)
    process.exit(found.length === 0 ? 0 : 0)
  })
  .example('$0 history', 'Scan through all the git repository history')
  .example('$0 history <start>...<end>', 'Scan the git repository from the "<start>" commit to the "<end>" commit.\n\nNote: The "<start>" commit is not included but "<end>" is')
  .boolean(['r'])
  .alias('r', 'remote')
  .describe('r', 'Check found tokens against Canvas')
  .help('h')
  .alias('h', 'help')
  .demandCommand()
  .argv
