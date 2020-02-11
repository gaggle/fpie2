/* global after before describe it */

const { basename, join } = require('path')
const { strictEqual, ok } = require('assert')

const { compile } = require('nexe')

const { sh } = require('./spawner')

function contains (content, needle) {
  return content.indexOf(needle) > 0
}

describe('compiled fpie2', () => {
  let tmp
  let fpie2

  async function compileFpie2 () {
    tmp = (await sh(`mktemp -d /tmp/fpie2.${basename(__filename)}.XXXXXX`)).trim()
    fpie2 = join(tmp, 'fpie2')
    await compile({
      input: './src/index.js',
      output: fpie2
    })
  }

  before(async function () {
    this.timeout(10000)
    await compileFpie2()
  })

  after(async function () {
    await sh(`rm -rf ${tmp}`)
  })

  it('can show help', async () => {
    const output = await sh(`${fpie2} --help`)
    ok(contains(output, 'FPIE2 tarballs a directory'), `--help should output help, got:\n${output}`)
  })

  it('can print files', async () => {
    const output = await sh(`${fpie2} . include.txt --print-files`, { cwd: 'test/fixtures/simple' })
    strictEqual(output, './foo.txt\n')
  })

  it('can output to tar', async () => {
    const output = await sh(`${fpie2} . include.txt | tar -tz`, { cwd: 'test/fixtures/simple' })
    // ⬑ "tar -t" lists content of archive to stdout
    strictEqual(output, 'foo.txt\n')
  })
})
