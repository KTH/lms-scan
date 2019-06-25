const test = require('ava')
const tmp = require('tmp')
const scanRepo = require('../scanRepo.js')
const path = require('path')

const fakeDir = path.resolve(__dirname, 'fake-data/')

test('Calling "scanRepo" in a non-repo throws', async t => {
  const d = tmp.dirSync({ prefix: 'lms-scan__test' })
  await t.throwsAsync(() => scanRepo(d.name))
  d.removeCallback()
})

test('Calling "scanRepo" with non-existing commits SHA throws', async t => {
  await t.throwsAsync(() => scanRepo(fakeDir, { from: 'xxx', to: 'xxx' }))
})

test('Calling "scanRepo" with non-ancestor commits throws', async t => {
  await t.throwsAsync(() => scanRepo(fakeDir, { from: '6c4f8df', to: 'e4f270e' }))
})

test('Happy path', async t => {
  await scanRepo(fakeDir, { from: '4c56649', to: '17d808f' })
  t.pass()
})
