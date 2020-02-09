const { basename, resolve: pathResolve } = require('path')

/**
 * @typedef ParsedArgs
 * @type {object}
 * @property {string} contextSrc
 * @property {string} includeFile
 * @property {boolean} printFiles
 */

/**
 * @param {string[]} argv
 * @returns {ParsedArgs}
 */
module.exports.parseArgs = async function (argv = process.argv) {
  return new Promise((resolve, reject) => {
    let callName = basename(argv.shift())
    argv.shift() // Script, ignore it
    if (argv.includes('--help') || argv.includes('-h')) {
      console.log(
        `Usage: ${callName} [OPTIONS] <CONTEXTDIR> <INCLUDEFILE>

FPIE2 tarballs a directory based on glob-patterns in an include/exclude-file

Options:
  --print-files\t\tPrint files to be included instead of emitting tarball

INCLUDEFILE syntax:
  Each line is a rule to include or exclude filepath(s) in CONTEXTDIR,
  and paths are defined relative to the context path.
  You can include a file:
    > some-file
  Or all files in a folder:
    > some-dir/
  (you can also use a trailing * to specify a directory, i.e. "some-dir/*")
  Prepend "!" for exclusions:
    > !some-file-to-exclude
  Or exclude an entire directory:
    > !some-dir-to-exclude/
  All entries are expanded as glob patterns, e.g.:
    > **/package.json
    > !**/node_modules
  Comments are lines that start with "#":
    > # This is a comment`)
      process.exit(0)
    }

    const printFiles = argv.includes('--print-files')
    if (printFiles) argv = argv.filter(el => el !== '--print-files')

    if (argv.length === 0) return reject(new Error('Must specify CONTEXTDIR and INCLUDEFILE'))
    if (argv.length === 1) return reject(new Error('Must specify INCLUDEFILE'))

    resolve({
      contextSrc: pathResolve(argv[0]),
      includeFile: pathResolve(argv[1]),
      printFiles
    })
  })
}
