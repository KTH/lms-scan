#!/usr/bin/env node
const scanDirectory = require('./scanDirectory')
const scanRepo = require('./scanRepo')

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

// eslint-disable-next-line no-unused-expressions
require('yargs')
  .usage('Usage: $0')
  .usage('Usage: $0 history [range]')
  .command('$0', 'Scan the current directory', () => {}, async (argv) => {
    const found = await scanDirectory(process.cwd())
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
    printVulnerabilities(found)
    process.exit(found.length === 0 ? 0 : 0)
  })
  .example('$0 history', 'Scan through all the git repository history')
  .example('$0 history <start>...<end>', 'Scan the git repository from the "<start>" commit to the "<end>" commit.\n\nNote: The "<start>" commit is not included but "<end>" is')
  .help('h')
  .alias('h', 'help')
  .demandCommand()
  .argv
