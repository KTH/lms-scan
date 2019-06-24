const simpleGit = require('simple-git/promise')
const scanDirectory = require('./scanDirectory')
const fs = require('fs')
const path = require('path')

async function getCurrentHead (git) {
  const status = await git.status()

  if (status.current === 'HEAD') {
    const log = await git.log({n: 1})
    return log.latest.hash
  } else {
    return status.current
  }
}

module.exports = async function scanRepo (repoPath, {from, to} = {}) {
  const git = simpleGit(repoPath)

  if (! (await git.checkIsRepo())) {
    console.log(`Directory [${repoPath}] is not a git repository`)
  }

  const status = await git.status()

  if (! status.isClean()) {
    console.log(`The repo [${repoPath}] is not clean.`)
  }

  const head = await getCurrentHead(git)
  const commits = (await git.log({from, to})).all
  const problems = []

  for (const commit of commits) {
    await git.checkout(commit.hash)
    console.group(`Commit ${commit.hash}`)
    scanDirectory(repoPath)
    console.groupEnd()
  }

  await git.checkout(head)
}
