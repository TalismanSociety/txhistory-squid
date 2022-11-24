const { version } = require('../package.json')
const { spawnSync } = require('child_process')

const projectName = process.env.PROJECT_NAME || 'tx-history'
const githubUrl = process.env.GITHUB_URL || 'https://github.com/TalismanSociety/firesquid-tx-history.git#master'

const squidCommand = process.argv.includes('--update') ? 'update' : 'release'
const reset = squidCommand === 'update' && process.argv.includes('--reset') ? '--hardReset' : ''

const completeVersion = process.argv.includes('--test') ? `v${version}-test` : `v${version}`

const command = `sqd squid ${squidCommand} -v ${projectName}@${completeVersion} --source ${githubUrl} ${reset}`
console.log(command)
spawnSync(command, { shell: true, stdio: [process.stdin, process.stdout, process.stderr], encoding: 'utf-8' })
