const test = require('ava')
const scanRepo = require('../scanRepo.js')
const path = require('path')

test('Detect a token that appears in one commit only', async t => {
  const vulnerabilities = (await scanRepo(path.resolve(__dirname, 'fake-data/')))
    .map(v => ({
      secrets: v.secrets,
      commit: v.commit
    }))

  t.deepEqual(vulnerabilities, [{
    secrets: ['8779~this_is_also_a_token'],
    commit: '9532a18'
  }])
})
