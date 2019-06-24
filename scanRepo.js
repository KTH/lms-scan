const simpleGit = require('simple-git/promise')
const scanDirectory = require('./scanDirectory')

module.exports = async function scanRepo (repoPath, {from, to} = {}) {
  const git = simpleGit(repoPath)

  if (! (await git.checkIsRepo())) {
    console.log(`Directory [${repoPath}] is not a git repository`)
  }

  if (! (await git.status()).isClean()) {
    console.log(`The repo [${repoPath}] is not clean.`)
  }

  const commits = (await git.log({from, to})).all
  const problems = []

  for (const commit of commits) {
    await git.checkout(commit.hash)
    console.group(`Commit ${commit.hash}`)
    scanDirectory(repoPath)
    console.groupEnd()
  }
}
