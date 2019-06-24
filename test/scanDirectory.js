const test = require('ava')
const scanDirectory = require('../scanDirectory.js')

test('foo', async t => {
  const vulnerabilities = (await scanDirectory(__dirname + '/fake-data'))
        .map(v => ({secrets: v.secrets}))

  t.deepEqual(vulnerabilities, [{
    secrets: ['8779~thisisatoken']
  }])
})
