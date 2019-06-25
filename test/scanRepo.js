const test = require('ava')
const tmp = require('tmp')
const scanRepo = require('../scanRepo.js')

test('Calling "scanRepo" in a non-repo throws', async t => {
  const d = tmp.dirSync({ prefix: 'lms-scan__test' })
  await t.throwsAsync(() => scanRepo(d.name))
  d.removeCallback()
})
