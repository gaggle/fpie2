const { basename } = require('path')
const { deepStrictEqual: equal, ok } = require('assert')

const { sh, spawnPromise } = require('./spawner')

describe('get.sh', () => {
  let tmp

  before(async function () {
    tmp = (await sh(`mktemp -d /tmp/fpie2.${basename(__filename)}.XXXXXX`)).trim()
  })

  after(async function () {
    await sh(`rm -rf ${tmp}`)
  })

  it('should calculate downloading Ubuntu release', async function () {
    const result = await sh(`cat get.sh | UNAME_OUT=Linux DRYRUN=true VERSION=v1.0.0 TO=${tmp} sh`)
    equal(result, `Downloading v1.0.0 of fpie2-ubuntu for Linux from https://github.com/gaggle/fpie2/releases/download/v1.0.0/fpie2-ubuntu to ${tmp}\n`)
  })

  it('should calculate downloading Mac release', async function () {
    const result = await sh(`cat get.sh | UNAME_OUT=Darwin DRYRUN=true VERSION=v1.0.0 TO=${tmp} sh`)
    equal(result, `Downloading v1.0.0 of fpie2-macos for Mac from https://github.com/gaggle/fpie2/releases/download/v1.0.0/fpie2-macos to ${tmp}\n`)
  })

  it('should be able to run the downloaded binary', async function () {
    this.timeout(60000)
    await sh(`cat get.sh | VERSION=v1.0.0 TO=${tmp} sh`)
    const result = await spawnPromise(`${tmp}/fpie2`, ['--help'])
    ok(result.includes('Usage:'), `Did not find help text, got:\n${result}`)
  })
})
