/* global after before describe it */

const { spawn } = require('child_process')
const { strictEqual, ok } = require('assert')

const { compile } = require('nexe')
const { file } = require('tmp-promise')

function contains (content, needle) {
  return content.indexOf(needle) > 0
}

describe('compiled fpie', () => {
  let fpie
  let cleanupFn

  async function compileFpie () {
    const { path, cleanup } = await file()
    await compile({
      input: './src/index.js',
      output: path
    })
    fpie = path
    cleanupFn = cleanup
  }

  before(async function () {
    this.timeout(10000)
    await compileFpie()
  })

  after(async function () {
    await cleanupFn()
  })

  it('can show help', async () => {
    const output = await sh(`${fpie} --help`)
    ok(contains(output, 'FPIE2 tarballs a directory'), `--help should output help, got:\n${output}`)
  })

  it('can print files', async () => {
    const output = await sh(`${fpie} . include.txt --print-files`, { cwd: 'test/fixtures/simple' })
    strictEqual(output, './foo.txt\n')
  })

  it('can output to tar', async () => {
    const output = await sh(`${fpie} . include.txt | tar -t`, { cwd: 'test/fixtures/simple' })
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
