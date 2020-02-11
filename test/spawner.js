const { spawn } = require('child_process')

/**
 * @param {string} command
 * @param {string[]} args
 * @param {{cwd:string}} opts
 * @returns {Promise<string>}
 */
module.exports.spawnPromise = spawnPromise = async function (command, args = [], opts = {}) {
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

/**
 * @param {string} command
 * @param {{cwd:string}} opts
 * @returns {Promise<string>}
 */
module.exports.sh = async (command, opts = {}) => spawnPromise('sh', ['-c', `${command}`], opts)
