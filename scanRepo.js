const git = require('isomorphic-git')
const fs = require('fs')
const searchToken = require('./searchToken.js')

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
  const repoRoot = await git.findRoot({ filepath: repoPath })

  if (from && to) {
    const ancestor = await git.expandOid({ dir: repoRoot, oid: from })
    const oid = await git.expandOid({ dir: repoRoot, oid: to })
    const isDescendent = await git.isDescendent({ dir: repoRoot, oid, ancestor })
    if (!isDescendent) {
      const e = Error(`Commit ${from} is not ascendent of ${to}`)
      e.type = 'NotAscendingCommit'
      throw e
    }

    const commits = await git.log({ dir: repoRoot, ref: oid, depth: 100 })
    const vulnerabilities = []

    for (const commit of commits) {
      if (commit.oid === ancestor) {
        break
      }

      const files = await git.listFiles({ dir: repoRoot, ref: commit.oid })

      for (const file of files) {
        const { object: blob } = await git.readObject({
          dir: repoRoot,
          oid: commit.oid,
          filepath: file,
          encoding: 'utf8'
        })

        const tokens = searchToken.inString(blob)
        if (tokens.length > 0) {
          vulnerabilities.push({
            commit: commit.oid,
            filepath: file,
            tokens
          })
        }
      }
    }
    return vulnerabilities
  }
  // const files = await git.listFiles({ dir: repoRoot, ref: 'HEAD' })
}
