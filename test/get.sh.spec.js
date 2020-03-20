const { assertContains } = require('./utils')
const { sh } = require('./spawner')

describe('get.sh', () => {
  describe('in theory', () => {
    it('should calculate downloading Alpine release', async function () {
      const result = await sh(`cat get.sh | UNAME_OUT=Linux RELEASE_PRETTY_NAME="Alpine Linux v3.11" DRYRUN=true VERSION=v1.0.0 TO=. sh`)
      assertContains(result, `Would download fpie2-alpine for Alpine from https://github.com/gaggle/fpie2/releases/download/v1.0.0/fpie2-alpine to .`)
    })

    it('should calculate downloading Amazon Linux release', async function () {
      const result = await sh(`cat get.sh | UNAME_OUT=Linux RELEASE_PRETTY_NAME="Amazon Linux 2" DRYRUN=true VERSION=v1.0.0 TO=. sh`)
      assertContains(result, `Would download fpie2-ubuntu for Amazon Linux from https://github.com/gaggle/fpie2/releases/download/v1.0.0/fpie2-ubuntu to .`)
    })

    it('should calculate downloading Linux Mint release', async function () {
      const result = await sh(`cat get.sh | UNAME_OUT=Linux RELEASE_PRETTY_NAME="Linux Mint 19.2" DRYRUN=true VERSION=v1.0.0 TO=. sh`)
      assertContains(result, `Would download fpie2-ubuntu for Linux Mint from https://github.com/gaggle/fpie2/releases/download/v1.0.0/fpie2-ubuntu to .`)
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

  describe('actually running', () => {
    const fn = process.env.EXPECTED_FILENAME
    const os = process.env.EXPECTED_OS
    if (fn && os) {
      it(`should want to download ${fn} for ${os}`, async () => {
        const result = await sh(`cat get.sh | DRYRUN=true VERSION=v1.0.0 TO=. sh`)
        assertContains(result, `Would download ${fn} for ${os}`)
      })
    }
  })
})
