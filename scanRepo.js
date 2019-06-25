const git = require('isomorphic-git')
const fs = require('fs')
git.plugins.set('fs', fs)

/*
async function getCurrentHead (git) {
  const status = await git.status()

  if (status.current === 'HEAD') {
    const log = await git.log({ n: 1 })
    return log.latest.hash
  } else {
    return status.current
  }
}
*/

module.exports = async function scanRepo (repoPath, { from, to } = {}) {
  await git.findRoot({ filepath: repoPath })
  // const files = await git.listFiles({ dir: repoRoot, ref: 'HEAD' })
}
