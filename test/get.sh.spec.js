const { ok, AssertionError } = require('assert')

const { contains } = require('./utils')
const { sh } = require('./spawner')

describe('get.sh', () => {
  describe('in theory', () => {
    it('should calculate downloading Alpine release', async function () {
      const result = await sh(`cat get.sh | UNAME_OUT=Linux RELEASE_PRETTY_NAME="Alpine Linux v3.11" DRYRUN=true VERSION=v1.0.0 TO=. sh`)
      assertContains(result, `Would download fpie2-alpine for Alpine from https://github.com/gaggle/fpie2/releases/download/v1.0.0/fpie2-alpine to .`)
    })

    it('should calculate downloading Mac release', async function () {
      const result = await sh(`cat get.sh | UNAME_OUT=Darwin DRYRUN=true VERSION=v1.0.0 TO=. sh`)
      assertContains(result, `Would download fpie2-macos for Mac from https://github.com/gaggle/fpie2/releases/download/v1.0.0/fpie2-macos to .`)
    })

    it('should calculate downloading Ubuntu release', async function () {
      const result = await sh(`cat get.sh | UNAME_OUT=Linux RELEASE_PRETTY_NAME="Ubuntu 18.04.4 LTS" DRYRUN=true VERSION=v1.0.0 TO=. sh`)
      assertContains(result, `Would download fpie2-ubuntu for Ubuntu from https://github.com/gaggle/fpie2/releases/download/v1.0.0/fpie2-ubuntu to .`)
    })
  })
})

function assertContains (actual, expected) {
  try {
    ok(contains(actual, expected))
  } catch (err) {
    if (err instanceof AssertionError) {
      throw new AssertionError({
        message: `Input A expected to contain input B:
Expected :${expected}
Actual   :${actual}`,
        actual: actual,
        expected: expected,
      })
    }
    throw err
  }
}
