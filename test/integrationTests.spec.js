/* global after before describe it */

const { join } = require('path')
const { promisify } = require('util')
const { ok } = require('assert')

const temp = require('temp').track()
const { compile } = require('nexe')

const { contains } = require('./utils')
const { sh } = require('./spawner')

/** @type {Function} */
const tempMkdir = promisify(temp.mkdir)

describe('compiled fpie2', () => {
  let fpie2

  async function compileFpie2 () {
    const tmp = await tempMkdir('fpie2')
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

  it('can show help', async () => {
    const output = await sh(`${fpie2} --help`)
    ok(contains(output, 'FPIE2 tarballs a directory'), `--help should output help, got:\n${output}`)
  })

  it('can print files', async () => {
    const output = await sh(`${fpie2} . include.txt --print-files`, { cwd: 'test/fixtures/simple' })
    ok(contains(output, './foo.txt'))
  })

  it('can output to tar', async () => {
    const output = await sh(`${fpie2} . include.txt | tar -tz`, { cwd: 'test/fixtures/simple' })
    // ⬑ "tar -t" lists content of archive to stdout
    ok(contains(output, 'foo.txt'))
  })
})
