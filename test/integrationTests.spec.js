/* global after before describe it */

const { basename, join } = require('path')
const { spawn } = require('child_process')
const { strictEqual, ok } = require('assert')

const { compile } = require('nexe')

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

/**
 * @param {string} command
 * @param {{cwd:string}} opts
 * @returns {Promise<string>}
 */
const sh = async (command, opts = {}) => spawnPromise('sh', ['-c', `${command}`], opts)

/**
 * @param {string} command
 * @param {string[]} args
 * @param {{cwd:string}} opts
 * @returns {Promise<string>}
 */
async function spawnPromise (command, args = [], opts = {}) {
  return new Promise((resolve, reject) => {
    let msg = ''
    const p = spawn(command, args, opts)
    p.stderr.on('data', data => msg += data.toString())
    p.stdout.on('data', data => msg += data.toString())
    p.on('close', code => {
      code === 0 ? resolve(msg) : reject(new Error(msg))
    })
  })
}
