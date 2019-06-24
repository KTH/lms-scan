const test = require('ava')
const scanDirectory = require('../scanDirectory.js')
const path = require('path')

test('Check a token in a directory', async t => {
  const vulnerabilities = (await scanDirectory(path.resolve(__dirname, 'fake-data/')))
    .map(v => ({ secrets: v.secrets }))

  t.deepEqual(vulnerabilities, [{
    secrets: ['8779~thisisatoken']
  }])
})
