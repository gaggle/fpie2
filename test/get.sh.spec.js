const { ok } = require('assert')

const { contains } = require('./utils')
const { sh } = require('./spawner')

describe('get.sh', () => {
  it('should calculate downloading Mac release', async function () {
    const result = await sh(`cat get.sh | UNAME_OUT=Darwin DRYRUN=true VERSION=v1.0.0 TO=. sh`)
    ok(contains(result, `Downloading v1.0.0 of fpie2-macos for Mac from https://github.com/gaggle/fpie2/releases/download/v1.0.0/fpie2-macos to .`))
  })

  it('should calculate downloading Ubuntu release', async function () {
    const result = await sh(`cat get.sh | UNAME_OUT=Linux DRYRUN=true VERSION=v1.0.0 TO=. sh`)
    ok(contains(result, `Downloading v1.0.0 of fpie2-ubuntu for Linux from https://github.com/gaggle/fpie2/releases/download/v1.0.0/fpie2-ubuntu to .`))
  })
})
