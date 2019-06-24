const simpleGit = require('simple-git/promise')
const scanDirectory = require('./scanDirectory')

async function getCurrentHead (git) {
  const status = await git.status()

  if (status.current === 'HEAD') {
    const log = await git.log({ n: 1 })
    return log.latest.hash
  } else {
    return status.current
  }
}

module.exports = async function scanRepo (repoPath, { from, to } = {}) {
  const git = simpleGit(repoPath)

  if (!(await git.checkIsRepo())) {
    console.log(`Directory [${repoPath}] is not a git repository`)
  }

  const status = await git.status()

  if (!status.isClean()) {
    console.log(`The repo [${repoPath}] is not clean.`)
  }

  const head = await getCurrentHead(git)
  const commits = (await git.log({ from, to })).all
  let vulnerabilities = []

  for (const commit of commits) {
    await git.checkout(commit.hash)
    console.group(`Commit ${commit.hash}`)
    const vuls = (await scanDirectory(repoPath, (p) => git.checkIgnore(p)))
      .map(v => ({
        commit: commit.hash,
        ...v
      }))

    vulnerabilities = vulnerabilities.concat(vuls)
    console.groupEnd()
  }

  await git.checkout(head)
  return vulnerabilities
}
